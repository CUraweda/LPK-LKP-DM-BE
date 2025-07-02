import Joi from "joi";

export const memberTestValidator = {
  create: Joi.object({
    memberId: Joi.number().integer().required(),
    examId: Joi.number().integer().required(),
    status: Joi.string().valid("Pending", "Selesai").required()
  }),

  update: Joi.object({
    answer: Joi.array()
      .items(
        Joi.object({
          index: Joi.number().integer().required(),
          answer: Joi.string().required()
        })
      )
      .min(1)
      .required(),
    questionsCompleted: Joi.number().integer().min(1).required(),
    secondsCompleted: Joi.number().integer().min(0).required(),
    status: Joi.string().valid("Pending", "Selesai").required()
  })
};

export default memberTestValidator;
