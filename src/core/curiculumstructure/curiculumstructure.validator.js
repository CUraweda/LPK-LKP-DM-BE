import Joi from "joi";

export const curiculumStructureValidator = {
  create: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    timePerHour: Joi.number().required()
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    timePerHour: Joi.number().optional()
  })
};

export default curiculumStructureValidator;
