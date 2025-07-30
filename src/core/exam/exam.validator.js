import Joi from "joi";

const questionSchema = Joi.object({
  index: Joi.number().integer().min(0).required(),
  question: Joi.string().min(5).required(),
  answer: Joi.string().min(1).required()
});

const newQuestionSchema = Joi.object({
  question: Joi.string().min(5).required(),
  list: Joi.string().custom((value, helpers) => {
    const parts = value.split('|');
    if (parts.length !== 2) return helpers.message('List pertanyaan harus lebih dari 1');
    return value;
  }).optional()
});

export const examValidator = {
  create: Joi.object({
    date: Joi.date().optional(),
    trainingId: Joi.number().integer().required(),
    title: Joi.string().min(3).required(),
    description: Joi.string().allow('').required(),
    totalQuestions: Joi.number().integer().min(1).required(),
    totalHours: Joi.number().integer().min(1).required(),
    questions: Joi.array().items(questionSchema).min(1).required()
  }),

  update: Joi.object({
    trainingId: Joi.number().integer(),
    title: Joi.string().min(3),
    description: Joi.string().allow(''),
    totalQuestions: Joi.number().integer().min(1),
    totalHours: Joi.number().integer().min(1),
    questions: Joi.array().items(questionSchema)
  }),

  generate: Joi.object({
    trainingId: Joi.number().integer(),
    title: Joi.string().min(3),
    description: Joi.string().allow(''),
    questions: Joi.array().items(newQuestionSchema)
  }),

  updateQuestion: Joi.object({
    questions: Joi.array().items(newQuestionSchema)
  })
};

export default examValidator;
