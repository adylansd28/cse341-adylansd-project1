import { Router } from "express";
import usersRouter from "./users.js";
import workoutsRouter from "./workouts.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/workouts", workoutsRouter);

export default router;