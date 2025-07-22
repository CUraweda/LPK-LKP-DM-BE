// src/core/authentication/authentication.validator.js
import Joi from 'joi';
import constant from '../../config/constant.js';

const AuthenticationValidator = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refresh: Joi.object({
    refresh_token: Joi.string().required(),
  }),

  register: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().max(constant.MAX_LEN_PW),
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

  forgotPassword: Joi.object({
    email: Joi.string()
  }),
  resetPass: Joi.object({
    encoded_email: Joi.string().required(),
    new_password: Joi.string().max(constant.MAX_LEN_PW).required(),
    confirm_password: Joi.string()
      .max(constant.MAX_LEN_PW)
      .valid(Joi.ref('new_password'))
      .messages({
        'any.only': 'Konfirmasi password tidak cocok dengan password baru',
      })
      .required(),
  }),
};

export default AuthenticationValidator;
