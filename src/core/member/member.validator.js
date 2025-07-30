import Joi from "joi";

export const memberValidator = {
  create: Joi.object({
    name: Joi.string(),
    dataVerified: Joi.boolean()
  }),
  patchVerified: Joi.object({
    verified: Joi.boolean(),
  }),
  updateMe: Joi.object({
    name: Joi.string().allow(""),
    phoneNumber: Joi.string().allow(""),
    nationalId: Joi.string().allow(""), 
    studentNumber: Joi.string().allow(""),
    religion: Joi.string().allow(""),
    gender: Joi.valid("L", "P").allow(""),
    placeOfBirth: Joi.string().allow(""),
    dateOfBirth: Joi.date().allow(""),
    socialHelp: Joi.string().allow(""),
    province: Joi.string().allow(""),
    city: Joi.string().allow(""), 
    district: Joi.string().allow(""),
    village: Joi.string().allow(""),
    postalCode: Joi.number().integer(),
    detailedAddress: Joi.string().allow(""),
    fromUpdateMe: Joi.boolean().default(true)
  }),
  update: Joi.object({
    name: Joi.string().allow(""),
    totalCourses: Joi.number().integer(),
    totalCoursesPrice: Joi.number().precision(2),
    totalCourseHours: Joi.number().integer(),
    totalExamCompleted: Joi.number().integer(),
    totalMaterials: Joi.number().integer(),
    totalCareers: Joi.number().integer(),
    currentCourseId: Joi.number().integer(),
    dataVerified: Joi.boolean(),
    isGraduate: Joi.boolean()
  }),
  extend_data_siswa: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().max(10),
    createNew: Joi.boolean().default(false),
    name: Joi.string().allow(""),
    nationalId: Joi.string().allow(""), 
    studentNumber: Joi.string().allow(""),
    religion: Joi.string().allow(""),
    gender: Joi.valid("L", "P").allow(""),
    placeOfBirth: Joi.string().allow(""),
    dateOfBirth: Joi.date().allow(""),
    phoneNumber: Joi.string().allow(""),
    socialHelp: Joi.string().allow(""),
    province: Joi.string().allow(""),
    city: Joi.string().allow(""), 
    district: Joi.string().allow(""),
    village: Joi.string().allow(""),
    postalCode: Joi.number().integer(),
    detailedAddress: Joi.string().allow("")
  }),
  extend_data_ibu: Joi.object({
    name: Joi.string().allow(""),
    salary: Joi.number(),
    workplace: Joi.string().allow(""),
    placeOfBirth: Joi.string().allow(""),
    dateOfBirth: Joi.date(),
    phoneNumber: Joi.string().allow("")
  }),
  extend_data_ayah: Joi.object({
    name: Joi.string().allow(""),
    salary: Joi.number(),
    workplace: Joi.string().allow(""),
    placeOfBirth: Joi.string().allow(""),
    dateOfBirth: Joi.date(),
    phoneNumber: Joi.string().allow("")
  }),
  extend_data_wali: Joi.object({
    parentAsGuardian: Joi.boolean().default(false),
    name: Joi.string().optional().allow(""),
    salary: Joi.number().optional().allow(""),
    workplace: Joi.string().optional().allow(""),
    placeOfBirth: Joi.string().optional().allow(""),
    dateOfBirth: Joi.date().optional().allow(""),
    phoneNumber: Joi.string().optional().allow("")
  }),
  extend_data_kursus: Joi.object({
    trainingId: Joi.number().integer(),
    persetujuanPembayaran: Joi.boolean().default(false),
    persetujuanOrangtuaWali: Joi.boolean().default(false)
  }),
  extend_data_pembayaran: Joi.object({
    paymentMethod: Joi.string()
  })
};

export default memberValidator;
