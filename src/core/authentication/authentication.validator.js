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
    nik: Joi.string().required(),
    nisn: Joi.string().required(),
    gender: Joi.number().required().min(0).max(1),
    birth_place: Joi.string().required(),
    birth_date: Joi.date().required(),
    religion: Joi.string().required(),
    phone: Joi.string().max(15).required(),
    social_assistences: Joi.string(),
    profile_pic_path: Joi.string().required(),
    province: Joi.string().required(),
    regency: Joi.string().required(),
    subdistrict: Joi.string().required(),
    village: Joi.string().required(),
    postal_code: Joi.string().required(),
    address: Joi.string().required(),
    is_verified: Joi.bool()
  }),

  asignMotherAndFather: Joi.object({
    name: Joi.string().required(),
    job: Joi.string().required(),
    income: Joi.number().required(),
    birth_place: Joi.string().required(),
    birth_date: Joi.date().required(),
    religion: Joi.string().required(),
    phone: Joi.string().max(15).required(),
  }),

  asignGuardian: Joi.object({
    is_parent_date: Joi.bool().required(),
    name: Joi.string(),
    job: Joi.string(),
    income: Joi.number(),
    birth_place: Joi.string(),
    birth_date: Joi.date(),
    religion: Joi.string(),
    phone: Joi.string().max(15),
  }),

  asignCourse: Joi.object({
    name: Joi.string().required(),
    level: Joi.number().required(),
  }),

  asignCourse: Joi.object({
    payment_to: Joi.string().required(),
  }),
};

export default AuthenticationValidator;
