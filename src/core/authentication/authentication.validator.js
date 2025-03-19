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
    email: Joi.string().email(),
    password: Joi.string().max(constant.MAX_LEN_PW),
    confirm_password: Joi.string()
      .max(constant.MAX_LEN_PW)
      .valid(Joi.ref('password'))
      .messages({
        'any.only': 'Konfirmasi password tidak cocok dengan password',
      }),
    role_id: Joi.number().optional(),
  }).custom((values) => {
    // Hapus field confirm_password agar tidak diteruskan ke service
    const { confirm_password, ...rest } = values;
    return rest;
  }),

  asignStudent: Joi.object({
    fullname: Joi.string().required(),
    nik: Joi.number().required(),
    nisn: Joi.number().required(),
    gender: Joi.number().required().min(0).max(1),
    birthplace: Joi.string().required(),
    birthdate: Joi.date().required(),
    religion: Joi.string().required(),
    phone: Joi.string().required(),
    profile_pic_path: Joi.string().required(),
    province: Joi.string().required(),
    city: Joi.string().required(),
    subdistrict: Joi.string().required(),
    ward: Joi.string().required(),
    postal_code: Joi.string().required(),
    specific_address: Joi.string().required()
  }),
};

export default AuthenticationValidator;
