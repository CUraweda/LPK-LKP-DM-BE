import Joi from "joi";

export const curiculumStructureValidator = {
  create: Joi.object({
    name: Joi.string().required()
  }),
  update: Joi.object({
    name: Joi.string().optional()
  })
};

export default curiculumStructureValidator;
