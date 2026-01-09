import express from "express";
import * as authController from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { registerSchema, loginSchema } from "../validations/auth.js";
import { generalLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", generalLimiter, validate(registerSchema), authController.register);
router.post("/login", generalLimiter, validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.getMe);

export default router;
