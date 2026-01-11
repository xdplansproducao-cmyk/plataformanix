import BlogPost from '../models/BlogPost.js'

class BlogPostService {
  async create(data, userId) {
    const slug = await BlogPost.generateUniqueSlug(data.title)
    
    // Converter string "true"/"false" para boolean se necessário
    const published = data.published === true || data.published === 'true'
    
    const blogPost = await BlogPost.create({
      ...data,
      slug,
      author: userId,
      published,
      publishedAt: published ? new Date() : null,
    })

    await blogPost.populate('author', 'name email')
    return blogPost
  }

  async getAll(filters = {}) {
    const {
      page = 1,
      limit = 12,
      category,
      tag,
      featured,
      published,
      search,
    } = filters

    const query = {}

    // Filtros
    if (category) query.category = category
    if (tag) query.tags = tag
    if (featured !== undefined) query.featured = featured
    if (published !== undefined) query.published = published
    
    // Busca por título ou conteúdo
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .populate('author', 'name email')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(query),
    ])

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getById(id) {
    const post = await BlogPost.findById(id).populate('author', 'name email')
    
    if (!post) {
      throw new Error('Post não encontrado')
    }

    return post
  }

  async getBySlug(slug) {
    const post = await BlogPost.findOne({ slug }).populate('author', 'name email')
    
    if (!post) {
      throw new Error('Post não encontrado')
    }

    // Incrementar visualizações
    post.views += 1
    await post.save()

    return post
  }

  async update(id, data) {
    const post = await BlogPost.findById(id)
    
    if (!post) {
      throw new Error('Post não encontrado')
    }

    // Se o título mudou, gerar novo slug
    if (data.title && data.title !== post.title) {
      data.slug = await BlogPost.generateUniqueSlug(data.title, id)
    }

    // Converter string "true"/"false" para boolean se necessário
    const published = data.published === true || data.published === 'true'
    const wasPublished = post.published

    // Se está publicando agora, definir data de publicação
    if (published && !wasPublished) {
      data.publishedAt = new Date()
    }

    // Se está despublicando, remover data de publicação
    if (data.published === false || data.published === 'false') {
      data.published = false
      if (wasPublished) {
        data.publishedAt = null
      }
    } else if (published) {
      data.published = true
    }

    Object.assign(post, data)
    await post.save()
    await post.populate('author', 'name email')

    return post
  }

  async delete(id) {
    const post = await BlogPost.findById(id)
    
    if (!post) {
      throw new Error('Post não encontrado')
    }

    await post.deleteOne()
    return post
  }

  async getFeatured(limit = 3) {
    const posts = await BlogPost.find({ published: true, featured: true })
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean()

    return posts
  }

  async getRelated(postId, limit = 3) {
    const post = await BlogPost.findById(postId)
    
    if (!post) {
      return []
    }

    const posts = await BlogPost.find({
      _id: { $ne: postId },
      published: true,
      $or: [
        { category: post.category },
        { tags: { $in: post.tags } },
      ],
    })
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean()

    return posts
  }

  async getCategories() {
    const categories = await BlogPost.distinct('category', { published: true })
    return categories
  }

  async getTags() {
    const tags = await BlogPost.aggregate([
      { $match: { published: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { tag: '$_id', count: 1, _id: 0 } },
    ])

    return tags
  }
}

export default new BlogPostService()
