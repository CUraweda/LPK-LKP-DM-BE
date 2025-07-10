import Joi from "joi";
import { type } from "os";

export const trainingValidator = {
  create: Joi.object({
     title: Joi.string().required(),
     description: Joi.string().required(),
     trainingImage: Joi.string().required(),
     type: Joi.string().valid("R", "P").required(),
     categoryId: Joi.number().integer().required(),
     totalParticipants: Joi.number().integer().required(),
     
  }),
  update: Joi.object({
    // no-data
  }),
};

export default trainingValidator;
