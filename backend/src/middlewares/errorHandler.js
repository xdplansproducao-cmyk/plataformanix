export const errorHandler = (err, req, res, _next) => {
  console.error("Erro:", err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      errors,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID inválido",
    });
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} já está em uso`,
    });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      errors: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
