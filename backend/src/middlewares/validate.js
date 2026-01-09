export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
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
