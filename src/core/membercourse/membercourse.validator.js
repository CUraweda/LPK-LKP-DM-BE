import Joi from "joi";

export const membercourseValidator = {
  create: Joi.object({
    memberId: Joi.number().integer().required(),
    trainingId: Joi.number().integer().required()
  }),
  update: Joi.object({
    memberId: Joi.number().integer(),
    trainingId: Joi.number().integer()
  }),
};

export default membercourseValidator;
