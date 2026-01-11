import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Label é obrigatório"],
      trim: true,
      maxlength: [50, "Label não pode ter mais de 50 caracteres"],
    },
    href: {
      type: String,
      required: [true, "URL é obrigatória"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      default: null,
    },
    menuType: {
      type: String,
      enum: ['main', 'footer', 'sidebar'],
      default: 'main',
    },
    contentType: {
      type: String,
      enum: ['custom', 'page', 'post', 'link'],
      default: 'custom',
    },
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      default: null,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      default: null,
    },
    target: {
      type: String,
      default: '_self',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index para ordenação
menuItemSchema.index({ order: 1 });
menuItemSchema.index({ published: 1 });
menuItemSchema.index({ parentId: 1 });
menuItemSchema.index({ menuType: 1 });

// Virtual para itens filhos
menuItemSchema.virtual("children", {
  ref: "MenuItem",
  localField: "_id",
  foreignField: "parentId",
});

// Virtual para conteúdo dinâmico
menuItemSchema.virtual("content", {
  ref: "Page",
  localField: "pageId",
  foreignField: "_id",
  justOne: true,
});

menuItemSchema.virtual("post", {
  ref: "BlogPost",
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
