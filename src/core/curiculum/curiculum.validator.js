import Joi from "joi";

export const curiculumValidator = {
  create: Joi.object({
    structureId: Joi.number().required(),
    competencyElement: Joi.string().required(),
    graduationIndicator: Joi.string().required()
  }),
  update: Joi.object({
    structureId: Joi.number().optional(),
    competencyElement: Joi.string().optional().allow(""),
    graduationIndicator: Joi.string().optional().allow("")
  }),
};

export default curiculumValidator;
