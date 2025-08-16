import Joi from "joi";

export const roleValidator = {
  create: Joi.object({
    name: Joi.string(),
    code: Joi.valid("SUPERADMIN", "ADMIN", "INSTRUKTUR", "PENGURUS","ANY"),
    identifier: Joi.string()
  }),
  update: Joi.object({
    name: Joi.string(),
    code: Joi.valid("SUPERADMIN", "ADMIN", "INSTRUKTUR", "PENGURUS", "ANY"),
    identifier: Joi.string()
  }),
};

export default roleValidator;
