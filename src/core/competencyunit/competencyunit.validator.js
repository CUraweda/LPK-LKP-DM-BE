import Joi from "joi";

export const competencyUnitValidator = {
  create: Joi.object({
    curiculumId: Joi.number().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
  }),
  update: Joi.object({
    curiculumId: Joi.number().optional(),
    code: Joi.string().optional(),
    name: Joi.string().optional(),
  }),
};

export default competencyUnitValidator;
