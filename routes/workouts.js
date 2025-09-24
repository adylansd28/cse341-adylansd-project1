// routes/workouts.js
import { Router } from "express";
import * as ctrl from "../controllers/workoutsController.js";
import validate from "../validators/validate.js";
import {
  workoutCreateSchema,
  workoutUpdateSchema,
} from "../validators/workoutsValidator.js";
import { isAuthenticated } from "../middleware/auth.js"; // 👈 guard

const r = Router();

/* Públicas */
r.get("/", ctrl.listWorkouts);
r.get("/:id", ctrl.getWorkoutById);

/* Protegidas (requieren login GitHub) */
r.post("/", isAuthenticated, validate(workoutCreateSchema), ctrl.createWorkout);
r.put("/:id", isAuthenticated, validate(workoutUpdateSchema), ctrl.updateWorkout);
r.delete("/:id", isAuthenticated, ctrl.deleteWorkout);

export default r;
