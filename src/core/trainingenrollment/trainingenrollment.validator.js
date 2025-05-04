import Joi from "joi";

export const trainingenrollmentValidator = {
  create: Joi.object({
    memberId: Joi.number().required(),
    scheduleId: Joi.number().required(),
    status: Joi.string().valid('Available','Unavailable', 'In_Progress', 'Completed').required()
  }),
  update: Joi.object({
    status: Joi.string().valid('Available','Unavailable', 'In_Progress', 'Completed').required(),
  }),
};

export default trainingenrollmentValidator;
