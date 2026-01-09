import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { updateRoleSchema } from "../validations/user.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id/role", validate(updateRoleSchema), userController.updateUserRole);

export default router;
