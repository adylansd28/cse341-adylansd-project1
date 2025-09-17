import Joi from "joi";

export const userCreateSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(13).max(100).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  heightCm: Joi.number().positive().required(),
  weightKg: Joi.number().positive().required(),
  goal: Joi.string().valid("lose_weight", "maintenance", "gain_muscle").required(),
  activityLevel: Joi.string().valid("low", "medium", "high").required(),
  createdAt: Joi.string().isoDate().optional()
});

export const userUpdateSchema = userCreateSchema.fork(
  ["name","email","age","gender","heightCm","weightKg","goal","activityLevel","createdAt"],
  (schema) => schema.optional()
);
