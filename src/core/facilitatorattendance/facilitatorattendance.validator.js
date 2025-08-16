import Joi from "joi";

export const facilitatorattendanceValidator = {
  create: Joi.object({
    facilitatorId: Joi.number().integer().required(), 
    location: Joi.string().required(),
    type: Joi.valid("H", "I", "S", "A").required(),
    typeSchedule: Joi.valid("IN", "OUT").required(),
  }),
  attend: Joi.object({
    location: Joi.string().optional(),
    type: Joi.valid("H", "I", "S", "A").optional(),
  }),
  update: Joi.object({
    facilitatorId: Joi.number().integer().optional(), 
    location: Joi.string().optional(),
    type: Joi.valid("H", "I", "S", "A").optional(),
    typeSchedule: Joi.valid("IN", "OUT").optional(),
  }),
};

export default facilitatorattendanceValidator;
