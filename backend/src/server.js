import app from "./app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`🚀 Servidor rodando na porta ${config.port}`);
      console.log(`📝 Ambiente: ${config.env}`);
      console.log(`🌐 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
