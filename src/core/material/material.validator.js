import Joi from "joi";

export const materialValidator = {
  createUpdate: Joi.object({
    trainingId: Joi.number().integer().required(),
    title: Joi.string().required()
  })
};

export default materialValidator;
