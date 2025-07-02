import Joi from "joi";

export const trainingValidator = {
  createUpdate: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().valid('R', 'P').required(),
    categoryId: Joi.number().integer().optional(),
    totalParticipants: Joi.number().integer().min(0).required(),
    totalCourses: Joi.number().integer().min(0).required(),
    totalHours: Joi.number().integer().min(0).required(),
    targetTrainingHours: Joi.number().integer().min(0).required(),
    isActive: Joi.boolean().required()
  }),
};

export default trainingValidator;
