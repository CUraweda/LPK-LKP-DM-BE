import Joi from "joi";

export const trainingscheduleValidator = {
  create: Joi.object({
    memberId: Joi.number().required(),
    trainingId: Joi.number().required(),
    startTime: Joi.date().required(),
    type: Joi.string().valid('R', 'P').required(),
  }),
  update: Joi.object({
    memberId: Joi.number().optional(),
    trainingId: Joi.number().optional(),
    startTime: Joi.date().optional(),
    type: Joi.string().valid('R', 'P').optional(),
  }),
};

export default trainingscheduleValidator;
