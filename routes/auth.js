// routes/auth.js
import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

/* Iniciar login con GitHub */
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

/* Callback de GitHub */
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/api-docs", session: false }),
  (req, res) => {
    // Guardar el usuario en sesión (como hizo tu profe)
    req.session.user = req.user;
    res.redirect("/"); // redirige al root
  }
);

/* Ver usuario actual (requiere login) */
router.get("/me", isAuthenticated, (req, res) => {
  res.json({ ok: true, user: req.session.user });
});

/* Ejemplo de ruta privada protegida */
router.get("/private", isAuthenticated, (req, res) => {
  res.json({
    ok: true,
    message: "This is a protected resource",
    user: req.session.user,
  });
});

/* Logout */
router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => res.json({ ok: true, message: "Logged out" }));
  });
});

/* Fallo de login */
router.get("/failure", (_req, res) =>
  res.status(401).json({ ok: false, error: "Authentication failed" })
);

export default router;
