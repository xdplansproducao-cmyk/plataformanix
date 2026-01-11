import { body } from "express-validator";

export const validateCreatePage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Título é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Título não pode ter mais de 200 caracteres"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug é obrigatório")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug deve conter apenas letras minúsculas, números e hífens")
    .isLength({ max: 200 })
    .withMessage("Slug não pode ter mais de 200 caracteres"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Conteúdo é obrigatório"),

  body("metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta título não pode ter mais de 60 caracteres"),

  body("metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta descrição não pode ter mais de 160 caracteres"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published deve ser um booleano"),
];

export const validateUpdatePage = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Título não pode estar vazio")
    .isLength({ max: 200 })
    .withMessage("Título não pode ter mais de 200 caracteres"),

  body("slug")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Slug não pode estar vazio")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug deve conter apenas letras minúsculas, números e hífens")
    .isLength({ max: 200 })
    .withMessage("Slug não pode ter mais de 200 caracteres"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Conteúdo não pode estar vazio"),

  body("metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta título não pode ter mais de 60 caracteres"),

  body("metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta descrição não pode ter mais de 160 caracteres"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published deve ser um booleano"),
];
