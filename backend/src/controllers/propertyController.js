import * as propertyService from "../services/propertyService.js";
import { successResponse } from "../utils/response.js";

export const getProperties = async (req, res, next) => {
  try {
    const result = await propertyService.getProperties(req.query);
    return successResponse(res, result, "Imóveis listados com sucesso");
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    return successResponse(res, property, "Imóvel encontrado");
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const propertyData = req.body;
    const images = req.files || [];
    const property = await propertyService.createProperty(
      propertyData,
      req.user._id,
      images
    );
    return successResponse(res, property, "Imóvel criado com sucesso", 201);
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const propertyData = req.body;
    const images = req.files || [];
    const property = await propertyService.updateProperty(
      req.params.id,
      propertyData,
      req.user._id,
      req.user.role,
      images
    );
    return successResponse(res, property, "Imóvel atualizado com sucesso");
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const result = await propertyService.deleteProperty(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return successResponse(res, result, "Imóvel excluído com sucesso");
  } catch (error) {
    next(error);
  }
};
