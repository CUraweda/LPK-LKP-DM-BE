import Joi from "joi";

export const trainingenrollmentValidator = {
  create: Joi.object({
    memberId: Joi.number().required(),
    scheduleId: Joi.number().required(),
    status: Joi.string().valid('BOOKED', 'IN_PROGRESS', 'COMPLETED').required()
  }),
  update: Joi.object({
    memberId: Joi.number().optional(),
    scheduleId: Joi.number().optional(),
    status: Joi.string().valid('BOOKED', 'IN_PROGRESS', 'COMPLETED').required()
  }),
};

export default trainingenrollmentValidator;
