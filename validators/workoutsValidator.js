import Joi from "joi";

export const workoutCreateSchema = Joi.object({
  userId: Joi.string().length(24).hex().required(),
  date: Joi.string().isoDate().required(),
  type: Joi.string().valid("run", "cycle", "strength", "other").required(),
  durationMin: Joi.number().positive().required(),
  calories: Joi.number().min(0).required(),
  distanceKm: Joi.number().min(0).optional(),
  notes: Joi.string().max(500).optional()
});

export const workoutUpdateSchema = workoutCreateSchema.fork(
  ["userId","date","type","durationMin","calories","distanceKm","notes"],
  (schema) => schema.optional()
);
