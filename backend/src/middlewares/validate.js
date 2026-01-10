export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Para rotas com multipart/form-data, parse req.body.data se existir
      let body = req.body;
      if (req.body.data && typeof req.body.data === 'string') {
        try {
          const parsedData = JSON.parse(req.body.data);
          body = { ...req.body, ...parsedData };
          delete body.data;
          req.body = body; // Modificar req.body para que o controller use os dados parseados
        } catch (parseError) {
          return res.status(400).json({
            success: false,
            message: "Dados inválidos no campo 'data'",
          });
        }
      }

      schema.parse({
        body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Erro de validação",
        errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
    }
  };
};
