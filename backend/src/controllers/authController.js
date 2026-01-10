import * as authService from "../services/authService.js";
import { successResponse } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return successResponse(res, result, "Usuário criado com sucesso", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return successResponse(res, result, "Login realizado com sucesso");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    return successResponse(res, user, "Usuário encontrado");
  } catch (error) {
    next(error);
  }
};
