import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Título é obrigatório"],
      trim: true,
      maxlength: [200, "Título não pode ter mais de 200 caracteres"],
    },
    slug: {
      type: String,
      required: [true, "Slug é obrigatório"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug deve conter apenas letras minúsculas, números e hífens",
      ],
    },
    content: {
      type: String,
      required: [true, "Conteúdo é obrigatório"],
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, "Meta título não pode ter mais de 60 caracteres"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta descrição não pode ter mais de 160 caracteres"],
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index para busca
pageSchema.index({ title: "text", content: "text" });
pageSchema.index({ published: 1 });

// Middleware para atualizar publishedAt quando published muda para true
pageSchema.pre("save", function (next) {
  if (this.isModified("published") && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Middleware para gerar slug automaticamente se não fornecido
pageSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

const Page = mongoose.model("Page", pageSchema);

export default Page;
