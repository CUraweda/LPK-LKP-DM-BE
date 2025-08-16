import Joi from "joi";
import constant from '../../config/constant.js';

export const userValidator = {
  create_admin: Joi.object({
    name: Joi.string(),
    phoneNumber: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    roleId: Joi.number().integer().optional(),
    confirm_password: Joi.number().integer()
      .max(constant.MAX_LEN_PW)
      .valid(Joi.ref('password'))
      .messages({
        'any.only': 'Konfirmasi password tidak cocok dengan password',
      }),
  }),

  create: Joi.object({
    email: Joi.string(),
    password: Joi.string(),
    memberId: Joi.number().integer(),
    roleId: Joi.number().integer(),
  }),

  update: Joi.object({
    email: Joi.string(),
    password: Joi.string(),
    memberId: Joi.number().integer(),
    roleId: Joi.number().integer()
  }),

  updateAdmin: Joi.object({
    name: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    confirm_password: Joi.string().optional()
      .max(constant.MAX_LEN_PW)
      .valid(Joi.ref('password'))
      .messages({
        'any.only': 'Konfirmasi password tidak cocok dengan password',
      }),
    isSuspended: Joi.boolean().default(false),
    roleId: Joi.number().integer().optional()
  }),


};

export default userValidator;
