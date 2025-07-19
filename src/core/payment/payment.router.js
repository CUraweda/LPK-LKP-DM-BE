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
    auth(['SISWA', 'ADMIN']),
    validatorMiddleware({ query: baseValidator.browseQuery }),
    controller.findMe
);

r.get(
    '/show-all',
    auth(['ADMIN']),
    validatorMiddleware({ query: baseValidator.browseQuery }),
    controller.findAll
);

r.get(
    '/show-chart',
    auth(['ADMIN']),
    controller.showChart
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
