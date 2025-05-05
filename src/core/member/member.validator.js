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
};

export default memberValidator;
