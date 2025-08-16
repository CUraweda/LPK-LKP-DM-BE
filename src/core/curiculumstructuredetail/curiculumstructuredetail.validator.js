import Joi from "joi";

export const curiculumStructureDetailValidator = {
  create: Joi.object({
    structureId: Joi.number().required(),
    type: Joi.string().optional(),
    code: Joi.string().optional(),
    competencyUnit: Joi.string().required(),
    hours: Joi.number().required(),
  }),
  update: Joi.object({
    structureId: Joi.number().optional(),
    type: Joi.string().optional(),
    code: Joi.string().optional(),
    competencyUnit: Joi.string().optional(),
    hours: Joi.number().optional(),
  }),
};

export default curiculumStructureDetailValidator;
