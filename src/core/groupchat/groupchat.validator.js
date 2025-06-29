import Joi from "joi";

export const groupchatValidator = {
  create: Joi.object({
    receiverId: Joi.number().integer(),
    senderId: Joi.number().integer()
  }),
  update: Joi.object({
    receiverId: Joi.number().integer(),
    senderId: Joi.number().integer()
  }),
};

export default groupchatValidator;
