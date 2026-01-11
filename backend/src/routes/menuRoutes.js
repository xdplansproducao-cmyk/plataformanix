import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
  getAvailablePages,
  getAvailablePosts,
} from "../controllers/menuController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Rota pública (para o navbar)
router.get("/", getMenuItems);

// Rotas protegidas (admin)
router.use(authenticate);
router.use(authorize("admin"));

router.post("/", createMenuItem);
router.get("/pages", getAvailablePages);
router.get("/posts", getAvailablePosts);
router.put("/reorder", reorderMenuItems);

router
  .route("/:id")
  .get(getMenuItemById)
  .put(updateMenuItem)
  .delete(deleteMenuItem);

export default router;
