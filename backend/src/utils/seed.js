import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Page from "../models/Page.js";
import BlogPost from "../models/BlogPost.js";
import Lead from "../models/Lead.js";
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

    const pagesSeed = [
      {
        title: "Sobre",
        slug: "sobre",
        content:
          "<h1>Sobre a Nix Imóveis</h1><p>Somos especialistas em imóveis e atendimento humanizado.</p><p>Encontre seu próximo lar com a gente.</p>",
        metaTitle: "Sobre | Nix Imóveis",
        metaDescription: "Conheça a Nix Imóveis e nossa forma de trabalhar.",
        published: true,
      },
      {
        title: "Contato",
        slug: "contato",
        content:
          "<h1>Contato</h1><p>Fale com a gente pelo WhatsApp ou envie uma mensagem pelo formulário.</p>",
        metaTitle: "Contato | Nix Imóveis",
        metaDescription: "Entre em contato com a Nix Imóveis.",
        published: true,
      },
      {
        title: "Política de Privacidade",
        slug: "politica-de-privacidade",
        content:
          "<h1>Política de Privacidade</h1><p>Respeitamos sua privacidade e cuidamos dos seus dados.</p>",
        metaTitle: "Privacidade | Nix Imóveis",
        metaDescription: "Política de privacidade e uso de dados.",
        published: true,
      },
    ];

    await Promise.all(
      pagesSeed.map((page) =>
        Page.findOneAndUpdate({ slug: page.slug }, page, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        })
      )
    );
    console.log(`✅ ${pagesSeed.length} páginas garantidas (upsert por slug)`);

    const postsSeed = [
      {
        title: "Como escolher o imóvel ideal em 5 passos",
        slug: "como-escolher-o-imovel-ideal-em-5-passos",
        excerpt:
          "Descubra os pontos essenciais para tomar a melhor decisão na hora de comprar ou alugar.",
        content:
          "<h1>Como escolher o imóvel ideal</h1><p>Defina orçamento, localização, tamanho e objetivos. Visite com calma e compare opções.</p>",
        coverImage: null,
        author: agent._id,
        category: "dicas",
        tags: ["imóveis", "dicas", "compra"],
        published: true,
        publishedAt: new Date(),
        featured: true,
      },
      {
        title: "Documentação para compra de imóvel: checklist completo",
        slug: "documentacao-para-compra-de-imovel-checklist",
        excerpt:
          "Um guia rápido com os documentos mais comuns que você vai precisar na compra.",
        content:
          "<h1>Checklist de documentação</h1><p>RG/CPF, comprovantes, certidões e análise do imóvel. Consulte sempre seu corretor.</p>",
        coverImage: null,
        author: agent._id,
        category: "financiamento",
        tags: ["documentos", "financiamento"],
        published: true,
        publishedAt: new Date(),
        featured: false,
      },
      {
        title: "Tendências do mercado imobiliário em 2026",
        slug: "tendencias-do-mercado-imobiliario-2026",
        excerpt:
          "O que está em alta no mercado e como isso impacta quem compra ou vende.",
        content:
          "<h1>Tendências 2026</h1><p>Mais digitalização, imóveis compactos em boas localizações e maior demanda por áreas de lazer.</p>",
        coverImage: null,
        author: admin._id,
        category: "mercado",
        tags: ["mercado", "tendências"],
        published: true,
        publishedAt: new Date(),
        featured: false,
      },
    ];

    await Promise.all(
      postsSeed.map((post) =>
        BlogPost.findOneAndUpdate({ slug: post.slug }, post, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        })
      )
    );
    console.log(`✅ ${postsSeed.length} posts garantidos (upsert por slug)`);

    const existingLeadsCount = await Lead.countDocuments();
    if (existingLeadsCount === 0) {
      const firstProperty = await Property.findOne().sort({ createdAt: -1 }).lean();
      const leadsSeed = [
        {
          name: "Mariana Souza",
          email: "mariana.souza@email.com",
          phone: "(11) 98888-0001",
          message: "Olá! Tenho interesse nesse imóvel. Podemos agendar uma visita?",
          propertyId: firstProperty?._id,
          source: "site",
          isRead: false,
          readAt: null,
        },
        {
          name: "Carlos Pereira",
          email: "carlos.pereira@email.com",
          phone: "(11) 98888-0002",
          message: "Gostaria de mais detalhes sobre valores e condições.",
          propertyId: firstProperty?._id,
          source: "site",
          isRead: true,
          readAt: new Date(),
        },
        {
          name: "Ana Beatriz",
          email: "ana.beatriz@email.com",
          phone: "(11) 98888-0003",
          message: "Esse imóvel aceita financiamento?",
          propertyId: firstProperty?._id,
          source: "whatsapp",
          isRead: false,
          readAt: null,
        },
      ];

      await Lead.insertMany(leadsSeed);
      console.log(`✅ ${leadsSeed.length} leads criados`);
    } else {
      console.log(`ℹ️  Já existem ${existingLeadsCount} leads no banco`);
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
