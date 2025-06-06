import Joi from "joi";
import constant from '../../config/constant.js';

export const userValidator = {
  create_admin: Joi.object({
    name: Joi.string(),
    phoneNumber: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    confirm_password: Joi.string()
      .max(constant.MAX_LEN_PW)
      .valid(Joi.ref('password'))
      .messages({
        'any.only': 'Konfirmasi password tidak cocok dengan password',
      }),
  }).custom((values) => {
    const { confirm_password, ...rest } = values;
    return rest;
  }),

  update: Joi.object({
    email: Joi.string(),
    password: Joi.string(),
    memberId: Joi.number().integer(),
    roleId: Joi.number().integer()
  }),
   
  updateAdmin: Joi.object({
    name: Joi.string(),
    isSuspended: Joi.boolean().default(false),
    roleId: Joi.number().integer()
  }),


};

export default userValidator;
