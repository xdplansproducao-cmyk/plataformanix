import { Favorite } from "../models/Favorite.js";
import { Property } from "../models/Property.js";

export const addFavorite = async (userId, propertyId) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("Imóvel não encontrado");
  }

  const existingFavorite = await Favorite.findOne({ userId, propertyId });
  if (existingFavorite) {
    throw new Error("Imóvel já está nos favoritos");
  }

  const favorite = await Favorite.create({ userId, propertyId });
  return await Favorite.findById(favorite._id).populate("propertyId");
};

export const getUserFavorites = async (userId) => {
  const favorites = await Favorite.find({ userId })
    .populate("propertyId")
    .sort({ createdAt: -1 });

  return favorites;
};

export const removeFavorite = async (userId, propertyId) => {
  const favorite = await Favorite.findOneAndDelete({ userId, propertyId });
  if (!favorite) {
    throw new Error("Favorito não encontrado");
  }
  return { message: "Favorito removido com sucesso" };
};
