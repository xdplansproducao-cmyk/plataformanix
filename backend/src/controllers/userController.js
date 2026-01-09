import * as userService from "../services/userService.js";
import { successResponse } from "../utils/response.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await userService.getAllUsers(page, limit);
    return successResponse(res, result, "Usuários listados com sucesso");
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user, "Usuário encontrado");
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await userService.updateUserRole(req.params.id, role);
    return successResponse(res, user, "Role atualizada com sucesso");
  } catch (error) {
    next(error);
  }
};
