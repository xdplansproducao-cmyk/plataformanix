import express from "express";
import {
  createPage,
  getPages,
  getPageById,
  getPageBySlug,
  updatePage,
  deletePage,
} from "../controllers/pageController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Rotas públicas
router.get("/slug/:slug", getPageBySlug);

// Rotas protegidas (admin)
router.use(authenticate);
router.use(authorize("admin"));

router
  .route("/")
  .post(createPage)
  .get(getPages);

router
  .route("/:id")
  .get(getPageById)
  .put(updatePage)
  .delete(deletePage);

export default router;
