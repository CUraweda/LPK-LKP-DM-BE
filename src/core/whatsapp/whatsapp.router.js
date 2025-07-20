import { Router } from 'express';
import multer from 'multer';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import WhatsappController from './whatsapp.controller.js';
import WhatsappValidator from './whatsapp.validator.js';
import auth from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = WhatsappValidator,
  controller = new WhatsappController();
const upload = multer({ dest: 'uploads/' });

r.get('/qr',auth(['ADMIN']), controller.getQr);

r.get('/start', auth(['ADMIN']), controller.startWhatsapp);

r.post(
  '/send-message',
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.sendMessage }),
  controller.sendMessage
);

const whatsappRouter = r;
export default whatsappRouter;
