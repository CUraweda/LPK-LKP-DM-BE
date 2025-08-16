import Joi from "joi";
import constant from "../../config/constant.js";

export const facilitatorValidator = {
  create: Joi.object({
    name: Joi.string().required(),
    position: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    userId: Joi.number().integer().required()
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    position: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    userId: Joi.number().integer().optional()
  }),
  generate: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(constant.MAX_LEN_PW),
    roleId: Joi.number().integer().required(),
    name: Joi.string().required(),
    position: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  })
};

export default facilitatorValidator;
