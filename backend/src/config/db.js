import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log(`✅ MongoDB conectado: ${config.mongodbUri}`);
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB desconectado");
});
