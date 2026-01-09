import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    phone: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Mensagem é obrigatória"],
      trim: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    source: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ email: 1 });
leadSchema.index({ propertyId: 1 });
leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model("Lead", leadSchema);
