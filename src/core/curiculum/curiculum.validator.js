import Joi from "joi";

export const curiculumValidator = {
  create: Joi.object({
    structureId: Joi.number().required(),
    name: Joi.string().required()
  }),
  update: Joi.object({
    structureId: Joi.number().optional(),
    name: Joi.string().optional()
  }),
};

export default curiculumValidator;
