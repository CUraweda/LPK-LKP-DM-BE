import Joi from "joi";

export const memberparentValidator = {
  create: Joi.object({
    name: Joi.string(),
    relation: Joi.valid("I", "A", "W").required(),
    workplace: Joi.string(),
    salary: Joi.number(),
    placeOfBirth: Joi.string(),
    dateOfBirth: Joi.date(),
    phoneNumber: Joi.string()
  }),
  update: Joi.object({
    name: Joi.string(),
    relation: Joi.valid("I", "A", "W").required(),
    workplace: Joi.string(),
    salary: Joi.number(),
    placeOfBirth: Joi.string(),
    dateOfBirth: Joi.date(),
    phoneNumber: Joi.string()
  }),
};

export default memberparentValidator;
