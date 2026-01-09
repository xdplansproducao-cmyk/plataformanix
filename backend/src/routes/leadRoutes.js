import express from "express";
import * as leadController from "../controllers/leadController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createLeadSchema, getLeadSchema } from "../validations/lead.js";
import { strictLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/", strictLimiter, validate(createLeadSchema), leadController.createLead);

router.use(authenticate);
router.use(authorize("admin", "agent"));

router.get("/", leadController.getAllLeads);
router.get("/:id", validate(getLeadSchema), leadController.getLeadById);

export default router;
