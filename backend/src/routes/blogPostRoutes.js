import { Router } from 'express'
import blogPostController from '../controllers/blogPostController.js'
import { authenticate, requireAdmin } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  getBlogPostsSchema,
  slugSchema,
} from '../validations/blogPost.js'
import { upload } from '../utils/upload.js'

const router = Router()

// Rotas públicas
router.get(
  '/',
  validate(getBlogPostsSchema),
  blogPostController.getAll
)

router.get(
  '/featured',
  blogPostController.getFeatured
)

router.get(
  '/categories',
  blogPostController.getCategories
)

router.get(
  '/tags',
  blogPostController.getTags
)

router.get(
  '/slug/:slug',
  validate(slugSchema),
  blogPostController.getBySlug
)

router.get(
  '/:id/related',
  blogPostController.getRelated
)

router.get(
  '/:id',
  blogPostController.getById
)

// Rotas protegidas (apenas admin)
router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('coverImage'),
  validate(createBlogPostSchema),
  blogPostController.create
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  upload.single('coverImage'),
  validate(updateBlogPostSchema),
  blogPostController.update
)

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  blogPostController.delete
)

export default router
