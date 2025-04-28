import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import paymentController from './payment.controller.js';
import paymentValidator from './payment.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import auth from '../../middlewares/auth.middleware.js';

const r = Router(),
validator = paymentValidator,
controller = new paymentController();

// r.get(
//     '/show-all',
//     validatorMiddleware({ query: baseValidator.browseQuery }),
//     controller.findAll
// );

// r.get(
//     '/show-recap-status',
//     auth(['ADMIN']),
//     controller.findRecapStatus
// );

// r.get('/show-one/:id', controller.findById);

// r.post(
//     '/create',
//     // auth(['ADMIN']),
//     validatorMiddleware({ body: validator.create }),
//     controller.create
// );


r.put(
    '/update/:id',
    // auth(['ADMIN']),
    validatorMiddleware({ body: validator.update }),
    controller.update
);

r.delete('/delete/:id', auth(['ADMIN']), controller.delete);


//! PAYMENT SECTION
r.get(
    "/notify/:id",
    controller.notify
)
r.get(
    "/inquiry/:id",
    // auth(['USER', 'ADMIN']),
    controller.notify
)
r.post(
    "/create",
    // auth(['USER']),
    validatorMiddleware({ body: validator.createPayment }),
    controller.createPayment
)

const paymentRouter = r;
export default paymentRouter;
