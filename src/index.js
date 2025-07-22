import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import httpStatus from 'http-status-codes';
import fs from "fs"
import { Server as IOServer } from 'socket.io';

import handleError from './exceptions/handler.exception.js';
import router from './routes.js';
import { initSocket } from './socket/index.js';
import auth from './middlewares/auth.middleware.js';
import path from 'path';
import { BadRequest, NotFound } from './exceptions/catch.execption.js';
import { startAllService } from './whatsapp/startWhatsapp.js';

const app = express();
dotenv.config();

app.disable('x-powered-by');
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION',
    credentials: true,
  })
);

const port = process.env.PORT || 8000;

const Server = http.createServer(app);
const io     = new IOServer(Server, { cors: { origin: '*' } });

// Make io accessible in routes
app.set('io', io);
startAllService(io)
io.on('connection', socket => {
  socket.on('join-room', room => {
    socket.join(room);
  });
  socket.on('leave-room', room => {
    socket.leave(room);
  });
  socket.on('disconnect', () => {
  });
});

app.use(
  bodyParser.json({
    limit: '50mb',
    type: ['application/json', 'application/vnd.api+json'],
  })
);
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 50000,
    extended: true,
  })
);
app.use(bodyParser.raw({ type: ['application/json', 'application/vnd.api+json'] }));
app.use(bodyParser.text({ type: 'text/html' }));

//? START Development Request Tracker
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'development') return next();

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    console.log(log);
  });

  next();
});
//? END Development Request Tracker
app.use("/public/assets/", express.static('public/assets'));

const allowedMime = ['.png', '.jpg', '.jpeg', '.pdf'];

//auth di hapus karena untuk get image di LP yang tanpa login
app.use("/file/load/", async (req, res, next) => {
  try {
    const relPath = decodeURIComponent(req.path);
    const ext = path.extname(relPath).toLowerCase();

    if (!allowedMime.includes(ext)) throw new BadRequest("Tipe file tidak bisa diambil");
    
    const baseDir = path.resolve('uploads');
    const fullPath = path.join(baseDir, relPath.replace(/^\/?uploads\/?/, ''));

    if (!fullPath.startsWith(baseDir)) throw new BadRequest("Denied")
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) throw new NotFound("File tidak ditemukan")

    return res.sendFile(fullPath);
  } catch (err) {
    next(err);
  }
});

app.use('/api/v1', router);
app.get('/api/download', auth(["ADMIN", "USER"]), (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(httpStatus.BAD_REQUEST).send({
      status: false,
      code: httpStatus.BAD_REQUEST,
      message: "File path not provided.",
    });
  }

  if (fs.existsSync(filePath)) {
    const filename = path.basename(filePath);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(httpStatus.NOT_FOUND).send({
      status: false,
      code: httpStatus.NOT_FOUND,
      message: "File not found.",
    });
  }
});

app.route('/').get((req, res) => {
  return res.json({
    message: 'Welcome to the API',
  });
});


app.use((req, res) => {
  return res.json({
    errors: {
      status: res.statusCode,
      data: null,
      error: {
        code: httpStatus.StatusCodes.NOT_FOUND,
        message: 'ENDPOINT_NOTFOUND',
      },
    },
  });
});

app.use(handleError);

const server = http.createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
// parsing biginteger
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
