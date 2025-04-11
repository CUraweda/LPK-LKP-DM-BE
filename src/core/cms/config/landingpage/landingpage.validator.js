import Joi from "joi";

export const landingPageValidator = {
  heroBanner: Joi.object({
    image_path: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required()
  }),
};

export default landingPageValidator;
