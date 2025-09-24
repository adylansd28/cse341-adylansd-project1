import { Router } from "express";
import passport from "passport";
import usersRouter from "./users.js";
import workoutsRouter from "./workouts.js";

const router = Router();

// Subrutas de tu API
router.use("/users", usersRouter);
router.use("/workouts", workoutsRouter);

// Login con GitHub (redirige a GitHub)
router.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Logout y limpiar sesión
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect("/"));
  });
});

export default router;