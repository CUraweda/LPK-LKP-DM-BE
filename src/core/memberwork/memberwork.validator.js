import Joi from "joi";

export const memberWorkValidator = {
  create: Joi.object({
    memberId: Joi.number().integer().required(),
    position: Joi.string().required(),
    status: Joi.string()
      .valid("Tetap", "Kontrak", "Part_Time", "Freelance")
      .required(),
    companyName: Joi.string().required(),
    isCurrentlyEmployed: Joi.boolean().required(),
    startDate: Joi.date().optional().allow(null),
    endDate: Joi.date().optional().allow(null),
    location: Joi.string().required(),
  }),

  update: Joi.object({
    memberId: Joi.number().integer().optional(),
    position: Joi.string().optional(),
    status: Joi.string().valid("Tetap", "Kontrak", "Part_Time", "Freelance").optional(),
    companyName: Joi.string().optional(),
    companyLogo: Joi.string().optional(),
    isCurrentlyEmployed: Joi.boolean().optional(),
    startDate: Joi.date().optional().allow(null),
    endDate: Joi.date().optional().allow(null),
    location: Joi.string().optional(),
  }),
};

export default memberWorkValidator;
