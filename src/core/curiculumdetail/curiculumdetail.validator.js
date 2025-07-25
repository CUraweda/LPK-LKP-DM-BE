import Joi from "joi";

export const curiculumDetailValidator = {
  create: Joi.object({
    curiculumId: Joi.number().required(),
    type: Joi.string().required(),
    code: Joi.string().required(),
    competency: Joi.string().required(),
    elementCompetency: Joi.string().required(),
    indikator: Joi.string().required(),
  }),
  update: Joi.object({
    curiculumId: Joi.number().optional(),
    type: Joi.string().optional(),
    code: Joi.string().optional(),
    elementCompetency: Joi.string().optional(),
    competency: Joi.string().optional(),
    indikator: Joi.string().optional(),
  }),
};

export default curiculumDetailValidator;
