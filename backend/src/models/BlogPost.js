import { Schema, model } from 'mongoose'

const blogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
      maxlength: [200, 'O título deve ter no máximo 200 caracteres'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'O resumo é obrigatório'],
      trim: true,
      maxlength: [500, 'O resumo deve ter no máximo 500 caracteres'],
    },
    content: {
      type: String,
      required: [true, 'O conteúdo é obrigatório'],
    },
    coverImage: {
      type: String,
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['dicas', 'mercado', 'financiamento', 'decoracao', 'noticias', 'outros'],
      default: 'outros',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Índices
blogPostSchema.index({ slug: 1 })
blogPostSchema.index({ published: 1, publishedAt: -1 })
blogPostSchema.index({ category: 1 })
blogPostSchema.index({ tags: 1 })
blogPostSchema.index({ featured: 1 })

// Virtual para gerar URL amigável
blogPostSchema.virtual('url').get(function () {
  return `/blog/${this.slug}`
})

// Método para gerar slug único
blogPostSchema.statics.generateUniqueSlug = async function (title, id = null) {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  let slug = baseSlug
  let counter = 1

  while (true) {
    const query = { slug }
    if (id) query._id = { $ne: id }
    
    const existing = await this.findOne(query)
    if (!existing) break
    
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

const BlogPost = model('BlogPost', blogPostSchema)

export default BlogPost
