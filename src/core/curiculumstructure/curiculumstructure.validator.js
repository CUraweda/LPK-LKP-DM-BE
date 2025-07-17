import Joi from "joi";

export const curiculumStructureValidator = {
  create: Joi.object({
    type: Joi.string().required(),
    code: Joi.string().required(),
    competencyUnit: Joi.string().required(),
    timePerHour: Joi.number().min(1).max(60),
    hours: Joi.number().required()
  }),
  update: Joi.object({
    type: Joi.string().optional(),
    code: Joi.string().optional(),
    competencyUnit: Joi.string().optional(),
    timePerHour: Joi.number().min(1).max(60),
    hours: Joi.number().optional()
  })
};

export default curiculumStructureValidator;
