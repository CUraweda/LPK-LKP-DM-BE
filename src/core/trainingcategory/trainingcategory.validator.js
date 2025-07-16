import Joi from "joi";

export const trainingCategoryValidator = {
  create: Joi.object({
    title: Joi.string().required(),
    level: Joi.number().integer()
  }),
  update: Joi.object({
    title: Joi.string().optional(),
    level: Joi.number().integer().optional()
  }),
};

export default trainingCategoryValidator;
