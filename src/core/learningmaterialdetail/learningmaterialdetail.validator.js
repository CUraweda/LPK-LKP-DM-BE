import Joi from "joi";

export const learningMaterialDetailValidator = {
  create: Joi.object({
    curiculumDetailId: Joi.number().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    weight: Joi.number().required(),
    duration: Joi.number().required(),
    methods: Joi.string().required(),
    indicator: Joi.string().required(),
    moduleCode: Joi.string().required(),
    moduleName: Joi.string().required()
  }),
  update: Joi.object({
    curiculumDetailId: Joi.number().optional(),
    code: Joi.string().optional(),
    name: Joi.string().optional(),
    weight: Joi.number().optional(),
    duration: Joi.number().optional(),
    methods: Joi.string().optional(),
    indicator: Joi.string().optional(),
    moduleCode: Joi.string().optional(),
    moduleName: Joi.string().optional()
  }),
};

export default learningMaterialDetailValidator;
