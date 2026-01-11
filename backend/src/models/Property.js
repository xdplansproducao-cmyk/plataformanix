import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Título é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Descrição é obrigatória"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["apartment", "house", "commercial", "land"],
      required: [true, "Tipo é obrigatório"],
    },
    status: {
      type: String,
      enum: ["sale", "rent"],
      required: [true, "Status é obrigatório"],
    },
    price: {
      type: Number,
      required: [true, "Preço é obrigatório"],
      min: [0, "Preço deve ser positivo"],
    },
    condoFee: {
      type: Number,
      min: [0, "Condomínio deve ser positivo"],
    },
    iptu: {
      type: Number,
      min: [0, "IPTU deve ser positivo"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Número de quartos é obrigatório"],
      min: [0, "Quartos deve ser positivo"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Número de banheiros é obrigatório"],
      min: [0, "Banheiros deve ser positivo"],
    },
    parkingSpots: {
      type: Number,
      required: [true, "Número de vagas é obrigatório"],
      min: [0, "Vagas deve ser positivo"],
    },
    area: {
      type: Number,
      required: [true, "Área é obrigatória"],
      min: [0, "Área deve ser positiva"],
    },
    address: {
      city: {
        type: String,
        required: [true, "Cidade é obrigatória"],
        trim: true,
      },
      neighborhood: {
        type: String,
        required: [true, "Bairro é obrigatório"],
        trim: true,
      },
      street: {
        type: String,
        required: [true, "Rua é obrigatória"],
        trim: true,
      },
      number: {
        type: String,
        required: [true, "Número é obrigatório"],
        trim: true,
      },
      zip: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        required: [true, "Estado é obrigatório"],
        trim: true,
        uppercase: true,
        minLength: [2, "Estado deve ter 2 caracteres"],
        maxLength: [2, "Estado deve ter 2 caracteres"],
      },
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ "address.city": 1, "address.neighborhood": 1 });
propertySchema.index({ type: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ isFeatured: 1 });
propertySchema.index({ createdAt: -1 });

const Property = mongoose.model("Property", propertySchema);

export default Property;
