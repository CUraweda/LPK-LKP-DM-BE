import Joi from "joi";

export const chatrecapValidator = {
  create: Joi.object({
    userId: Joi.number().integer()
  }),
  update: Joi.object({
    userId: Joi.number().integer().optional(),
    totalMessage: Joi.number().integer().optional(),
    unreadedMessage: Joi.number().integer().optional()
  }),
};

export default chatrecapValidator;
