import Joi from "joi";

export const membercourseValidator = {
  create: Joi.object({
    memberId: Joi.number().integer().required(),
    trainingId: Joi.number().integer().required(),
    persetujuanPembayaran: Joi.boolean().default(false),
    persetujuanOrangtuaWali: Joi.boolean().default(false)
  }),
  update: Joi.object({
    memberId: Joi.number().integer(),
    trainingId: Joi.number().integer(),
    persetujuanPembayaran: Joi.boolean().default(false),
    persetujuanOrangtuaWali: Joi.boolean().default(false)
  }),
};

export default membercourseValidator;
