import Lead from "../models/Lead.js";

// Função helper para transformar Lead do MongoDB para formato do frontend
const transformLead = (lead) => {
  if (!lead) return null;
  
  const leadObj = lead.toObject ? lead.toObject() : lead;
  
  return {
    ...leadObj,
    _id: leadObj._id.toString(),
    propertyId: leadObj.propertyId ? leadObj.propertyId._id?.toString() || leadObj.propertyId.toString() : null,
    // Se propertyId foi populado, transforma para property
    property: leadObj.propertyId && typeof leadObj.propertyId === 'object' 
      ? {
          _id: leadObj.propertyId._id.toString(),
          title: leadObj.propertyId.title,
          address: leadObj.propertyId.address,
        }
      : undefined,
    isRead: !!leadObj.isRead,
    readAt: leadObj.readAt || null,
  };
};

export const createLead = async (leadData) => {
  const lead = await Lead.create(leadData);
  const populated = await Lead.findById(lead._id)
    .populate("propertyId", "title address price")
    .lean();
  return transformLead(populated);
};

export const getAllLeads = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const leads = await Lead.find()
    .populate("propertyId", "title address price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();


  // Transforma os leads para o formato esperado pelo frontend
  const transformedLeads = leads.map(transformLead);

  return transformedLeads;
};

export const getLeadById = async (leadId) => {
  const lead = await Lead.findById(leadId)
    .populate("propertyId", "title address price")
    .lean();
  
  if (!lead) {
    throw new Error("Lead não encontrado");
  }
  
  return transformLead(lead);
};

export const getUnreadLeadsCount = async () => {
  const count = await Lead.countDocuments({ $or: [{ isRead: false }, { isRead: { $exists: false } }] });
  return { count };
};

export const getLeadsCount = async () => {
  const count = await Lead.countDocuments();
  return { count };
};

export const markLeadAsRead = async (leadId) => {
  const updated = await Lead.findByIdAndUpdate(
    leadId,
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  )
    .populate("propertyId", "title address price")
    .lean();

  if (!updated) {
    throw new Error("Lead não encontrado");
  }

  return transformLead(updated);
};
