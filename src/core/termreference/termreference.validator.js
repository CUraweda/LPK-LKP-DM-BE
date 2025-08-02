import Joi from "joi";

export const termreferenceValidator = {
  create: Joi.object({
    title: Joi.string().required(),
    type: Joi.valid("PERSETUJUAN_PEMBAYARAN", "PERSETUJUAN_ORANGTUA").required(),
    content: Joi.string().required()
  }),
  update: Joi.object({
    title: Joi.string(),
    type: Joi.valid("PERSETUJUAN_PEMBAYARAN", "PERSETUJUAN_ORANGTUA"),
    content: Joi.string()
  }),
};

export default termreferenceValidator;
