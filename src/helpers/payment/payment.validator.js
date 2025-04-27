import Joi from 'joi';

export const paymentValidator = {
    createQris: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        paymentType: Joi.string().required().default("QRIS"),
        amount: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value, helpers) => {
            const formattedValue = parseFloat(value).toFixed(2);
            return formattedValue
        }).required(),
        productName: Joi.string().required(),
        productInfo: Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            type: Joi.string().required(),
            quantity: Joi.number().integer().required()
        }),
        appUrl: Joi.string().required()
    }),
    createVa: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        paymentType: Joi.string().required(),
        amount: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value, helpers) => {
            const formattedValue = parseFloat(value).toFixed(2);
            return formattedValue
        }).required(),
        payer: Joi.string().required(),
        productName: Joi.string().required(),
        productInfo: Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            type: Joi.string().required(),
            quantity: Joi.number().integer().required()
        }),
        appUrl: Joi.string().required()
    }),
    inquiryQris: Joi.object({
        merchantTradeNo: Joi.string().required(),
        paymentType: Joi.string().required().default("QRIS")
    }),
    inquiryVa: Joi.object({
        customerNo: Joi.string().required(),
        virtualAccountNo: Joi.string().required(),
    }),
    cancelQris: Joi.object({
        merchantTradeNo: Joi.string().required(),
        platformTradeNo: Joi.string().required()
    }),
    updateVa: Joi.object({
        customerNo: Joi.string().required(),
        virtualAccountNo: Joi.string().required(),
        virtualAccountName: Joi.string().optional(),
        virtualAccountEmail: Joi.string().email().optional(),
        virtualAccountPhone: Joi.string().optional(),
        trxId: Joi.string().required(),
        totalAmount: Joi.object({
            value: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value, helpers) => {
                const formattedValue = parseFloat(value).toFixed(2);
                return formattedValue
            }).required(),
            currency: Joi.string().required().default("IDR")
        }),
        billDetails: Joi.object({
            billCode: Joi.string().required(),
            billName: Joi.string().required()
        }),
    })
};

export default paymentValidator;
