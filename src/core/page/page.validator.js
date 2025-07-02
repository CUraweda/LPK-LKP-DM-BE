import Joi from "joi";

export const pageValidator = {
  create: Joi.object({
    pageID: Joi.valid('REGISTER', 'LOGIN'),
    dividerTitle: Joi.string(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
  }),
  update: Joi.object({
    pageID: Joi.valid('REGISTER', 'LOGIN').optional(),
    dividerTitle: Joi.string().optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
  }),
};

export default pageValidator;
