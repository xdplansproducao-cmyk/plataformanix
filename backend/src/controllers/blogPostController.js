import blogPostService from '../services/blogPostService.js'
import { successResponse } from '../utils/response.js'

class BlogPostController {
  async create(req, res, next) {
    try {
      const data = { ...req.body }
      
      // Processar tags se vier como string JSON
      if (typeof data.tags === 'string') {
        try {
          data.tags = JSON.parse(data.tags)
        } catch {
          data.tags = []
        }
      }
      
      // Adicionar caminho da imagem se foi feito upload
      if (req.file) {
        data.coverImage = `/uploads/${req.file.filename}`
      }
      
      const blogPost = await blogPostService.create(data, req.user.id)
      successResponse(res, blogPost, 'Post criado com sucesso', 201)
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await blogPostService.getAll(req.query)
      successResponse(res, result, 'Posts obtidos com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const post = await blogPostService.getById(req.params.id)
      successResponse(res, post, 'Post obtido com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req, res, next) {
    try {
      const post = await blogPostService.getBySlug(req.params.slug)
      successResponse(res, post, 'Post obtido com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const data = { ...req.body }
      
      // Processar tags se vier como string JSON
      if (typeof data.tags === 'string') {
        try {
          data.tags = JSON.parse(data.tags)
        } catch {
          data.tags = []
        }
      }
      
      // Adicionar caminho da imagem se foi feito upload
      if (req.file) {
        data.coverImage = `/uploads/${req.file.filename}`
      }
      
      const post = await blogPostService.update(req.params.id, data)
      successResponse(res, post, 'Post atualizado com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      await blogPostService.delete(req.params.id)
      successResponse(res, null, 'Post excluído com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async getFeatured(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 3
      const posts = await blogPostService.getFeatured(limit)
      successResponse(res, posts, 'Posts em destaque obtidos com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async getRelated(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 3
      const posts = await blogPostService.getRelated(req.params.id, limit)
      successResponse(res, posts, 'Posts relacionados obtidos com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await blogPostService.getCategories()
      successResponse(res, categories, 'Categorias obtidas com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async getTags(req, res, next) {
    try {
      const tags = await blogPostService.getTags()
      successResponse(res, tags, 'Tags obtidas com sucesso')
    } catch (error) {
      next(error)
    }
  }
}

export default new BlogPostController()
