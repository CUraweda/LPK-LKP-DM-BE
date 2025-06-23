import Joi from "joi";

export const membercertificateValidator = {
  create: Joi.object({
    memberId: Joi.number().optional(),
    courseId: Joi.number(),
    imageTitle: Joi.string(),
  }),
  update: Joi.object({
    memberId: Joi.number().optional(),
    courseId: Joi.number(),
    imageTitle: Joi.string(),  
  }),
};

export default membercertificateValidator;
