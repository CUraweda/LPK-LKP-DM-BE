import Joi from "joi";

export const memberloanValidator = {
  create: Joi.object({
    memberId: Joi.number().integer().required(),  
    context: Joi.string().required(),
    total: Joi.number(), 
    isPaid: Joi.boolean().default(false), 
    paidAt: Joi.date().optional(),
    transactionId: Joi.number().integer().optional()
  }),
  update: Joi.object({
    memberId: Joi.number().integer().optional(),  
    context: Joi.string().optional,
    total: Joi.number(), 
    isPaid: Joi.boolean().default(false), 
    paidAt: Joi.date().optional(),
    transactionId: Joi.number().integer().optional()
  }),
  generate : Joi.object({
    memberId: Joi.number().integer().required(),  
    context: Joi.string().required(),
    listOfTotal: Joi.array().required(),
    createTransaction: Joi.boolean().default(false),
    paymentMethod: Joi.string().optional()
  }),
};

export default memberloanValidator;
