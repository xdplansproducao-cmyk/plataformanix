import * as leadService from "../services/leadService.js";
import { successResponse } from "../utils/response.js";

export const createLead = async (req, res, next) => {
  try {
    const lead = await leadService.createLead(req.body);
    return successResponse(res, lead, "Lead criado com sucesso", 201);
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await leadService.getAllLeads(page, limit);
    return successResponse(res, result, "Leads listados com sucesso");
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    return successResponse(res, lead, "Lead encontrado");
  } catch (error) {
    next(error);
  }
};

export const getUnreadLeadsCount = async (req, res, next) => {
  try {
    const result = await leadService.getUnreadLeadsCount();
    return successResponse(res, result, "Contagem de leads não lidos");
  } catch (error) {
    next(error);
  }
};

export const markLeadAsRead = async (req, res, next) => {
  try {
    const lead = await leadService.markLeadAsRead(req.params.id);
    return successResponse(res, lead, "Lead marcado como lido");
  } catch (error) {
    next(error);
  }
};

export const getLeadsCount = async (req, res, next) => {
  try {
    const result = await leadService.getLeadsCount();
    return successResponse(res, result, "Contagem total de leads");
  } catch (error) {
    next(error);
  }
};
