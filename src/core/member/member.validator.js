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
    dataVerified: Joi.boolean()
  }),
  extend_data_siswa: Joi.object({
    name: Joi.string(),
    nationalId: Joi.string(), 
    studentNumber: Joi.string(),
    religion: Joi.string(),
    gender: Joi.valid("L", "P"),
    placeOfBirth: Joi.string(),
    dateOfBirth: Joi.date(),
    religion: Joi.string(),
    phoneNumber: Joi.string(),
    socialHelp: Joi.string(),
    province: Joi.string(),
    city: Joi.string(), 
    district: Joi.string(),
    village: Joi.string(),
    postalCode: Joi.number().integer(),
    detailedAddress: Joi.string()
  })
};

export default memberValidator;
