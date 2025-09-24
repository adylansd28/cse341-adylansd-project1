import { Router } from "express";
import * as ctrl from "../controllers/usersController.js";
import validate from "../validators/validate.js";
import { userCreateSchema, userUpdateSchema } from "../validators/usersValidator.js";
import { isAuthenticated } from "../middleware/auth.js"; // 👈 importa el guard

const r = Router();

/* Rutas públicas */
r.get("/", ctrl.listUsers);
r.get("/:id", ctrl.getUserById);

/* Rutas protegidas (requieren login con GitHub) */
r.post("/", isAuthenticated, validate(userCreateSchema), ctrl.createUser);
r.put("/:id", isAuthenticated, validate(userUpdateSchema), ctrl.updateUser);
r.delete("/:id", isAuthenticated, ctrl.deleteUser);

export default r;