import { Router } from "express";
import * as ctrl from "../controllers/workoutsController.js";
import validate from "../validators/validate.js";
import { workoutCreateSchema, workoutUpdateSchema } from "../validators/workoutsValidator.js";

const r = Router();

r.get("/", ctrl.listWorkouts);
r.get("/:id", ctrl.getWorkoutById);
r.post("/", validate(workoutCreateSchema), ctrl.createWorkout);
r.put("/:id", validate(workoutUpdateSchema), ctrl.updateWorkout);
r.delete("/:id", ctrl.deleteWorkout);

export default r;