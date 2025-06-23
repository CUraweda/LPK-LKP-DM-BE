import Joi from "joi";

export const memberValidator = {
  create: Joi.object({
    name: Joi.string(),
    currentCourseId: Joi.number().integer(),
    dataVerified: Joi.boolean()
  }),
  patchVerified: Joi.object({
    verified: Joi.boolean(),
  }),
  update: Joi.object({
    name: Joi.string(),
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
    name: Joi.string(),
    nationalId: Joi.string(), 
    studentNumber: Joi.string(),
    religion: Joi.string(),
    gender: Joi.valid("L", "P"),
    placeOfBirth: Joi.string(),
    dateOfBirth: Joi.date(),
    phoneNumber: Joi.string(),
    socialHelp: Joi.string(),
    province: Joi.string(),
    city: Joi.string(), 
    district: Joi.string(),
    village: Joi.string(),
    postalCode: Joi.number().integer(),
    detailedAddress: Joi.string()
  }),
  extend_data_ibu: Joi.object({
    name: Joi.string(),
    salary: Joi.number(),
    workplace: Joi.string(),
    placeOfBirth: Joi.string(),
    dateOfBirth: Joi.date(),
    phoneNumber: Joi.string()
  }),
  extend_data_ayah: Joi.object({
    name: Joi.string(),
    salary: Joi.number(),
    workplace: Joi.string(),
    placeOfBirth: Joi.string(),
    dateOfBirth: Joi.date(),
    phoneNumber: Joi.string()
  }),
  extend_data_wali: Joi.object({
    parentAsGuardian: Joi.boolean().default(false),
    name: Joi.string().optional(),
    salary: Joi.number().optional(),
    workplace: Joi.string().optional(),
    placeOfBirth: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    phoneNumber: Joi.string().optional()
  }),
  extend_data_kursus: Joi.object({
    courseCategoryId: Joi.number().integer(),
    courseLevel: Joi.number().integer()
  }),
  extend_data_pembayaran: Joi.object({
    paymentMethod: Joi.string()
  })
};

export default memberValidator;
