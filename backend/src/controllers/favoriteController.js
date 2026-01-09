import * as favoriteService from "../services/favoriteService.js";
import { successResponse } from "../utils/response.js";

export const addFavorite = async (req, res, next) => {
  try {
    const favorite = await favoriteService.addFavorite(
      req.user._id,
      req.params.propertyId
    );
    return successResponse(res, favorite, "Favorito adicionado com sucesso", 201);
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getUserFavorites(req.user._id);
    return successResponse(res, favorites, "Favoritos listados com sucesso");
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const result = await favoriteService.removeFavorite(
      req.user._id,
      req.params.propertyId
    );
    return successResponse(res, result, "Favorito removido com sucesso");
  } catch (error) {
    next(error);
  }
};
