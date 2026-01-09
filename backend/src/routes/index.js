import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import propertyRoutes from "./propertyRoutes.js";
import leadRoutes from "./leadRoutes.js";
import favoriteRoutes from "./favoriteRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/leads", leadRoutes);
router.use("/favorites", favoriteRoutes);

export default router;
