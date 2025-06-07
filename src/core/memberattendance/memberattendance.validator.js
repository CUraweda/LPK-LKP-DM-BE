import Joi from "joi";

export const memberattendanceValidator = {
  create: Joi.object({
    memberId: Joi.number().integer(),
    rawDate: Joi.date(),
    location: Joi.string(),
    description: Joi.string(),
    type: Joi.valid("H", "I", "S", "A")
  }),
  attend: Joi.object({
    type: Joi.valid("H", "I", "S", "A"),
    location: Joi.string().optional(),
    description: Joi.string().optional(),
  }),
  update: Joi.object({
    rawDate: Joi.date(),
    location: Joi.string(),
    description: Joi.string(),
    type: Joi.valid("H", "I", "S", "A")
  }),
};

export default memberattendanceValidator;
