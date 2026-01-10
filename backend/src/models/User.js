import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    phone: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      trim: true,
    },
    birthDate: {
      type: Date,
      required: [true, "Data de nascimento é obrigatória"],
    },
    profession: {
      type: String,
      required: [true, "Profissão é obrigatória"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Cidade é obrigatória"],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Senha é obrigatória"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "agent", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
