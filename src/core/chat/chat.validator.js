import Joi from "joi";

export const chatValidator = {
  create: Joi.object({
    senderId: Joi.number().integer(),
    receiverId: Joi.number().integer(),
    message: Joi.string().optional(),
    sentAt: Joi.date().default(new Date())
  }),
  update: Joi.object({
    senderId: Joi.number().integer().optional(),
    receiverId: Joi.number().integer().optional(),
    message: Joi.string().optional(),
    imageLink: Joi.string().optional(),
    fileSize: Joi.string().optional(),
    fileLink: Joi.string().optional(),
    sentAt: Joi.date().optional(),
    type: Joi.valid("T", "I", "F"),
    sentAt: Joi.date().default(new Date())
  }),
  send: Joi.object({
    receiverId: Joi.number().integer(),
    message: Joi.string().optional(),
    sentAt: Joi.date().default(new Date())
  })
};

export default chatValidator;
