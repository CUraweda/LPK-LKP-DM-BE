import Joi from 'joi';

export const paymentHistoryValidator = {
    createPayment: Joi.object({
        purpose: Joi.string().required(),
        paymentTotal: Joi.number().required(),
        paymentMethod: Joi.string().required(),
        status: Joi.valid("Gagal",  "Tunda", "Berhasil").default("Tunda"), 
    }),
};

export default paymentHistoryValidator;
