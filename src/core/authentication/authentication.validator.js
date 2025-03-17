// src/core/authentication/authentication.validator.js
import Joi from 'joi';
import constant from '../../config/constant.js';

const AuthenticationValidator = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(constant.MAX_LEN_PW).required(),
  }),

  refresh: Joi.object({
    refresh_token: Joi.string().required(),
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
    phoneWA: Joi.string().required(),
    nik: Joi.number().required(),
    divisionId: Joi.string().required(),
    password: Joi.string().max(constant.MAX_LEN_PW).required(),
    confirm_password: Joi.string()
      .max(constant.MAX_LEN_PW)
      .valid(Joi.ref('password'))
      .messages({
        'any.only': 'Konfirmasi password tidak cocok dengan password',
      })
      .required(),
  }).custom((values) => {
    // Hapus field confirm_password agar tidak diteruskan ke service
    const { confirm_password, ...rest } = values;
    return rest;
  }),
};

export default AuthenticationValidator;
