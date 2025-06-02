import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import httpStatus from 'http-status-codes';

import { Server } from 'socket.io';
// import { startWhatsApp } from './utils/whatsappClient.js';
import handleError from './exceptions/handler.exception.js';
import router from './routes.js';

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
app.use(
  bodyParser.raw({ type: ['application/json', 'application/vnd.api+json'] })
);
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

app.use('/api/v1', router);

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
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });

  socket.on('')
});

server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
// parsing biginteger
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
