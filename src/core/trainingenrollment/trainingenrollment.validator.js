import Joi from "joi";

export const trainingenrollmentValidator = {
  create: Joi.object({
    memberId: Joi.number().required(),
    scheduleId: Joi.number().required(),
    status: Joi.string().valid('BOOKED', 'IN_PROGRESS', 'COMPLETED').required()
  }),
  update: Joi.object({
    status: Joi.string().valid('BOOKED', 'IN_PROGRESS', 'COMPLETED').required()
  }),
};

export default trainingenrollmentValidator;
