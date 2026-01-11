import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log("🌱 Iniciando seed...");

    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await User.findOneAndUpdate(
      { email: "admin@nix.com" },
      {
        name: "Admin Nix",
        email: "admin@nix.com",
        phone: "(11) 99999-9999",
        birthDate: new Date("1990-01-01"),
        profession: "Administrador",
        city: "São Paulo",
        passwordHash: adminPassword,
        role: "admin",
      },
      { upsert: true, new: true }
    );

    console.log("✅ Admin criado:", admin.email);

    const agentPassword = await bcrypt.hash("Agent@123", 10);
    const agent = await User.findOneAndUpdate(
      { email: "agent@nix.com" },
      {
        name: "Agente Nix",
        email: "agent@nix.com",
        phone: "(11) 88888-8888",
        birthDate: new Date("1985-05-15"),
        profession: "Corretor de Imóveis",
        city: "São Paulo",
        passwordHash: agentPassword,
        role: "agent",
      },
      { upsert: true, new: true }
    );

    console.log("✅ Agente criado:", agent.email);

    const propertiesCount = await Property.countDocuments();
    if (propertiesCount === 0) {
      const properties = [
        {
          title: "Apartamento Moderno no Centro",
          description:
            "Apartamento amplo e moderno, com 3 quartos, 2 banheiros, sala ampla, cozinha integrada e varanda. Localizado no coração da cidade, próximo a comércios e transporte público.",
          type: "apartment",
          status: "sale",
          price: 450000,
          condoFee: 800,
          iptu: 350,
          bedrooms: 3,
          bathrooms: 2,
          parkingSpots: 2,
          area: 95,
          address: {
            city: "São Paulo",
            neighborhood: "Centro",
            street: "Rua das Flores",
            number: "123",
            zip: "01000-000",
            state: "SP",
          },
          features: ["Varanda", "Cozinha integrada", "Área de serviço", "Portaria 24h"],
          images: [],
          isFeatured: true,
          createdBy: agent._id,
        },
        {
          title: "Casa com Piscina e Jardim",
          description:
            "Casa espaçosa com 4 quartos, 3 banheiros, sala de estar, sala de jantar, cozinha completa, área gourmet com churrasqueira, piscina e jardim. Ideal para famílias grandes.",
          type: "house",
          status: "rent",
          price: 3500,
          bedrooms: 4,
          bathrooms: 3,
          parkingSpots: 3,
          area: 180,
          address: {
            city: "São Paulo",
            neighborhood: "Jardins",
            street: "Avenida Paulista",
            number: "456",
            zip: "01310-100",
            state: "SP",
          },
          features: ["Piscina", "Jardim", "Churrasqueira", "Área gourmet", "Garagem coberta"],
          images: [],
          isFeatured: true,
          createdBy: agent._id,
        },
        {
          title: "Sala Comercial em Localização Premium",
          description:
            "Sala comercial ampla, bem localizada, com excelente fluxo de pessoas. Ideal para escritórios, consultórios ou lojas. Próximo a metrô e estacionamentos.",
          type: "commercial",
          status: "rent",
          price: 2500,
          bedrooms: 0,
          bathrooms: 1,
          parkingSpots: 1,
          area: 60,
          address: {
            city: "São Paulo",
            neighborhood: "Vila Olímpia",
            street: "Rua Funchal",
            number: "789",
            zip: "04551-060",
            state: "SP",
          },
          features: ["Ar condicionado", "Recepção", "Banheiro", "Estacionamento"],
          images: [],
          isFeatured: false,
          createdBy: agent._id,
        },
      ];

      await Property.insertMany(properties);
      console.log(`✅ ${properties.length} imóveis criados`);
    } else {
      console.log(`ℹ️  Já existem ${propertiesCount} imóveis no banco`);
    }

    console.log("✅ Seed concluído com sucesso!");
    console.log("\n📝 Credenciais:");
    console.log("Admin: admin@nix.com / Admin@123");
    console.log("Agent: agent@nix.com / Agent@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    process.exit(1);
  }
};

seed();
