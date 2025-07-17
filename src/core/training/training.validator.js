import Joi from "joi";
import { type } from "os";

export const trainingValidator = {
  createUpdate: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().valid('R', 'P').required(),
    level: Joi.number().integer().required(),
    isActive: Joi.boolean().required(),
    
    curiculumStructures: Joi.object({
      create: Joi.array().items(
        Joi.object({
          curiculumStructure: Joi.object({
            connect: Joi.object({
              id: Joi.number().integer().required()
            }).required()
          }).required()
        })
      ).required()
    }).required()
  }),
  update: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    type: Joi.string().valid('R', 'P').optional(),
    level: Joi.number().integer().optional(),
    isActive: Joi.boolean().optional(),
    trainingImage: Joi.any(),
    targetTrainingHours: Joi.number(),
    totalParticipants: Joi.number(),
    curiculumStructures: Joi.object({
      create: Joi.array().items(
        Joi.object({
          curiculumStructure: Joi.object({
            connect: Joi.object({
              id: Joi.number().integer().optional(),
            }).optional(),
          }).optional(),
        })
      ).optional(),
    }).optional(),
  }),

};

export default trainingValidator;
