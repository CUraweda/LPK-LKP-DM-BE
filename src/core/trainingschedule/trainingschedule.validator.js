import Joi from "joi";

export const trainingscheduleValidator = {
  create: Joi.object({
    memberId: Joi.number().required(),
    trainingId: Joi.number().required(),
    startTime: Joi.date().required(),
    type: Joi.string().valid('R', 'P').required(),
  }),
  update: Joi.object({
    // no-data
  }),
};

export default trainingscheduleValidator;
