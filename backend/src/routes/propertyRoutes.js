import express from "express";
import * as propertyController from "../controllers/propertyController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createPropertySchema,
  updatePropertySchema,
  getPropertiesSchema,
  getPropertySchema,
  deletePropertySchema,
} from "../validations/property.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.get("/", validate(getPropertiesSchema), propertyController.getProperties);
router.get("/:id", validate(getPropertySchema), propertyController.getPropertyById);

router.post(
  "/",
  authenticate,
  authorize("admin", "agent"),
  upload.array("images", 10),
  validate(createPropertySchema),
  propertyController.createProperty
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin", "agent"),
  upload.array("images", 10),
  validate(updatePropertySchema),
  propertyController.updateProperty
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "agent"),
  validate(deletePropertySchema),
  propertyController.deleteProperty
);

export default router;
