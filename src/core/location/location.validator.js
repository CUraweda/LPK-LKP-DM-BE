import Joi from "joi";

export const locationValidator = {
  create: Joi.object({
    name: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    range: Joi.number().integer().required()
  }),
  update: Joi.object({
    name: Joi.string(),
    latitude: Joi.string(),
    longitude: Joi.string(),
    range: Joi.number().integer()
  }),
};

export default locationValidator;
