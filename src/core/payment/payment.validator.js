import Joi from 'joi';

export const paymentHistoryValidator = {
    create: Joi.object({
        memberId: Joi.number().required(),
        status: Joi.valid("Gagal",  "Tunda", "Berhasil").required().default("Tunda"), 
        purpose: Joi.valid("Simpanan", "Pendaftaran").required(),
        paymentTotal: Joi.number().required(),
        paymentMethod: Joi.string(),
        paymentDate: Joi.date(),
        isPaid: Joi.boolean().required().default(false)
    }),
    createPayment: Joi.object({
        purpose: Joi.string().required(),
        transactionId: Joi.string().required(),
        paymentType: Joi.string().required(),
        payer: Joi.string().optional()
    }),
    update: Joi.object({
        memberId: Joi.string().required(),
        status: Joi.valid("Gagal",  "Tunda", "Berhasil").required().default("Tunda"), 
        purpose: Joi.valid("Simpanan", "Pendaftaran").required(),
        paymentMethod: Joi.string().required(),
        paymentTotal: Joi.number().required(),
        paymentDate: Joi.date().required(),
        isPaid: Joi.boolean().required().default(false)
    }),
};

export default paymentHistoryValidator;
