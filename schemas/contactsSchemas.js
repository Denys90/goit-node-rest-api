import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(2).max(16),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().default(false),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().optional().min(2).max(16),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  favorite: Joi.boolean().default(false),
});
