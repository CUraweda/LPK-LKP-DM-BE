import Joi from "joi";

export const chatValidator = {
  create: Joi.object({
    chatRecapId: Joi.number().integer(),
    message: Joi.string().optional(),
  }),
  update: Joi.object({
    senderId: Joi.number().integer().optional(),
    chatRecapId: Joi.number().integer().optional(),
    message: Joi.string().optional(),
    sentAt: Joi.date().optional(),
  }),
  send: Joi.object({
    message: Joi.string().optional(),
  })
};

export default chatValidator;
