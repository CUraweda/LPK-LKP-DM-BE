import Joi from "joi";

export const refScheduleValidator = {
  create: Joi.object({
    trainingId : Joi.number().integer().positive().required(),
    dayOfWeek : Joi.number().integer().min(0).max(6).required(),
    startHour : Joi.number().integer().min(0).max(23).required(),
    type : Joi.string().valid('R', 'P').required(),
    description: Joi.string().trim().max(255).allow(null, ""),
  }),

  update: Joi.object({
    trainingId : Joi.number().integer().positive().optional(),
    dayOfWeek  : Joi.number().integer().min(0).max(6).optional(),
    startHour  : Joi.number().integer().min(0).max(23).optional(),
    type       : Joi.string().valid('R', 'P').optional(),
    description: Joi.string().trim().max(255).allow(null, ""),
  }),
};

export default refScheduleValidator;
