import Joi from "joi";

export const trainingCategoryValidator = {
  create: Joi.object({
    title: Joi.string().required()
  }),
  update: Joi.object({
    title: Joi.string().required()
  }),
};

export default trainingCategoryValidator;
