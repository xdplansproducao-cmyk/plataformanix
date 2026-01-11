import { body } from "express-validator";

export const validateCreateMenuItem = [
  body("label")
    .trim()
    .notEmpty()
    .withMessage("Label é obrigatório")
    .isLength({ max: 50 })
    .withMessage("Label não pode ter mais de 50 caracteres"),

  body("href")
    .trim()
    .notEmpty()
    .withMessage("URL é obrigatória"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ordem deve ser um número inteiro não negativo"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published deve ser um booleano"),

  body("parentId")
    .optional()
    .isMongoId()
    .withMessage("Parent ID deve ser um ID MongoDB válido"),
];

export const validateUpdateMenuItem = [
  body("label")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Label não pode estar vazio")
    .isLength({ max: 50 })
    .withMessage("Label não pode ter mais de 50 caracteres"),

  body("href")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("URL não pode estar vazia"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ordem deve ser um número inteiro não negativo"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published deve ser um booleano"),

  body("parentId")
    .optional()
    .isMongoId()
    .withMessage("Parent ID deve ser um ID MongoDB válido"),
];
