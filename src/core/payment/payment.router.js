import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import paymentController from './payment.controller.js';
import paymentValidator from './payment.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import auth from '../../middlewares/auth.middleware.js';

const r = Router(),
validator = paymentValidator,
controller = new paymentController();

r.get(
    '/show-me',
    auth(['SISWA']),
    validatorMiddleware({ query: baseValidator.browseQuery }),
    controller.findMe
);

//! PAYMENT SECTION
r.get(
    "/notify/:id",
    controller.notify
)

r.post(
    "/create",
    auth(['SISWA']),
    validatorMiddleware({ body: validator.createPayment }),
    controller.createPayment
)

const paymentRouter = r;
export default paymentRouter;
