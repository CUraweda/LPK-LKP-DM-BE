import Joi from "joi";

export const trainingscheduleValidator = {
  create: Joi.object({
    memberId: Joi.number().required(),
    trainingId: Joi.number().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    type: Joi.string().valid('R', 'P').required(),
    status: Joi.string().valid('AVAILABLE', 'UNAVAILABLE').required(),
  }),
  update: Joi.object({
    // no-data
  }),
};

export default trainingscheduleValidator;
