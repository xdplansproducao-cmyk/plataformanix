import express from "express";
import * as favoriteController from "../controllers/favoriteController.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { favoritePropertySchema } from "../validations/favorite.js";

const router = express.Router();

router.use(authenticate);

router.post("/:propertyId", validate(favoritePropertySchema), favoriteController.addFavorite);
router.get("/", favoriteController.getUserFavorites);
router.delete("/:propertyId", validate(favoritePropertySchema), favoriteController.removeFavorite);

export default router;
