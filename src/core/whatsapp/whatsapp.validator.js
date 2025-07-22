import Joi from "joi";

export const WhatsappValidator = {
  sendMessage: Joi.object({
    number: Joi.string().required(),
    message: Joi.string().required()
  }),

};

export default WhatsappValidator;
