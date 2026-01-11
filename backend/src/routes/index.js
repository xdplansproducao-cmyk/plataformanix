import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import propertyRoutes from "./propertyRoutes.js";
import leadRoutes from "./leadRoutes.js";
import favoriteRoutes from "./favoriteRoutes.js";
import blogPostRoutes from "./blogPostRoutes.js";
import pageRoutes from "./pageRoutes.js";
import menuRoutes from "./menuRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/leads", leadRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/blog", blogPostRoutes);
router.use("/pages", pageRoutes);
router.use("/menu", menuRoutes);

export default router;
