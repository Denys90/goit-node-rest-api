import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(2).max(16),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().optional().min(2).max(16),
  email: Joi.string().email().optional(),
  phone: Joi.number().optional(),
});
