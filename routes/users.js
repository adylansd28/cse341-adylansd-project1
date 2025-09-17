import { Router } from "express";
import * as ctrl from "../controllers/usersController.js";
import validate from "../validators/validate.js";
import { userCreateSchema, userUpdateSchema } from "../validators/usersValidator.js";

const r = Router();

r.get("/", ctrl.listUsers);
r.get("/:id", ctrl.getUserById);
r.post("/", validate(userCreateSchema), ctrl.createUser);
r.put("/:id", validate(userUpdateSchema), ctrl.updateUser);
r.delete("/:id", ctrl.deleteUser);

export default r;