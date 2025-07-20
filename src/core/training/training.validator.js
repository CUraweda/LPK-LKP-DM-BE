import Joi from "joi";

export const trainingValidator = {
  createUpdate: Joi.object({
    title: Joi.string().required(),
    structureId: Joi.number().required(),
    description: Joi.string().required(),
    targetTrainingHours: Joi.number().optional(),
    type: Joi.string().valid('R', 'P').required(),
    level: Joi.number().integer().required(),
    isActive: Joi.boolean().required(),
  }),
  update: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    type: Joi.string().valid('R', 'P').optional(),
    level: Joi.number().integer().optional(),
    isActive: Joi.boolean().optional(),
    trainingImage: Joi.any(),
    targetTrainingHours: Joi.number().optional(),
    totalCourses: Joi.number().optional(),
    totalHours: Joi.number().optional(),
    totalParticipants: Joi.number().optional(),
    structureId: Joi.number().optional(),
  }),

};

export default trainingValidator;
