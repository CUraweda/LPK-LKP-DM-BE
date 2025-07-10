import Joi from "joi";

export const membersalaryValidator = {
    createUpdate: Joi.object({
      workId: Joi.number().integer().required(),
      memberId: Joi.number().integer().required(),
      monthIndex: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().integer().min(1900).max(2100).required(),
      basicSalary: Joi.number().precision(2).min(0).required(),
      allowance: Joi.number().precision(2).min(0).required(),
      bonus: Joi.number().precision(2).min(0).required(),
      overtime: Joi.number().precision(2).min(0).required(),
  })
};

export default membersalaryValidator;
