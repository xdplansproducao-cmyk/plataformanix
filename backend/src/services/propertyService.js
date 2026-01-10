import { Property } from "../models/Property.js";

const buildFilter = (query) => {
  const filter = {};

  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
      { "address.neighborhood": { $regex: query.q, $options: "i" } },
    ];
  }

  if (query.city) filter["address.city"] = { $regex: query.city, $options: "i" };
  if (query.neighborhood)
    filter["address.neighborhood"] = { $regex: query.neighborhood, $options: "i" };
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.bedrooms) filter.bedrooms = { $gte: query.bedrooms };
  if (query.bathrooms) filter.bathrooms = { $gte: query.bathrooms };
  if (query.parkingSpots) filter.parkingSpots = { $gte: query.parkingSpots };
  if (query.featured !== undefined) filter.isFeatured = query.featured;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = query.minPrice;
    if (query.maxPrice) filter.price.$lte = query.maxPrice;
  }

  return filter;
};

const buildSort = (query) => {
  let sortField = query.sort || "createdAt";
  // Converte 'featured' para 'isFeatured' se necessário
  if (sortField === "featured") {
    sortField = "isFeatured";
  }
  const sortOrder = query.order === "asc" ? 1 : -1;
  return { [sortField]: sortOrder };
};

// Função helper para transformar Property do MongoDB para formato do frontend
export const transformProperty = (property) => {
  if (!property) return null;
  
  const propertyObj = property.toObject ? property.toObject() : property;
  
  // Transforma address
  let transformedAddress = propertyObj.address;
  if (propertyObj.address) {
    transformedAddress = { ...propertyObj.address };
    // Converte zip para zipCode se necessário
    if (transformedAddress.zip && !transformedAddress.zipCode) {
      transformedAddress.zipCode = transformedAddress.zip;
    }
    // Remove zip do objeto final
    delete transformedAddress.zip;
  }
  
  return {
    ...propertyObj,
    _id: propertyObj._id.toString(),
    featured: propertyObj.isFeatured || false,
    images: (propertyObj.images || []).map(img => {
      if (typeof img === 'string') return img
      return img.url || ''
    }).filter(url => url !== ''),
    address: transformedAddress,
  };
};

export const getProperties = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = buildFilter(query);
  const sort = buildSort(query);

  const properties = await Property.find(filter)
    .populate("createdBy", "name email")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean(); // Use lean() para melhor performance

  const total = await Property.countDocuments(filter);

  // Transforma os properties para o formato esperado pelo frontend
  const transformedProperties = properties.map(transformProperty);

  return {
    data: transformedProperties,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
export const getPropertyById = async (propertyId) => {
  const property = await Property.findById(propertyId)
    .populate("createdBy", "name email")
    .lean();

  if (!property) {
    throw new Error("Imóvel não encontrado");
  }

  return transformProperty(property);
};

export const createProperty = async (propertyData, userId, images = []) => {
  const imageData = images.map((file) => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
  }));

  // Converte featured para isFeatured
  const { featured, ...restData } = propertyData;
  const dataToCreate = {
    ...restData,
    isFeatured: featured || false,
    images: imageData,
    createdBy: userId,
  };

  // Se address.zipCode existe, converte para address.zip
  if (dataToCreate.address?.zipCode) {
    dataToCreate.address.zip = dataToCreate.address.zipCode;
    delete dataToCreate.address.zipCode;
  }

  const property = await Property.create(dataToCreate);

  const created = await Property.findById(property._id)
    .populate("createdBy", "name email")
    .lean();

  return transformProperty(created);
};

export const updateProperty = async (propertyId, propertyData, userId, userRole, images = []) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("Imóvel não encontrado");
  }

  if (property.createdBy.toString() !== userId.toString() && userRole !== "admin") {
    throw new Error("Você não tem permissão para editar este imóvel");
  }

  // Converte featured para isFeatured
  const { featured, ...restData } = propertyData;
  const dataToUpdate = { ...restData };
  
  if (featured !== undefined) {
    dataToUpdate.isFeatured = featured;
  }

  // Se address.zipCode existe, converte para address.zip
  if (dataToUpdate.address?.zipCode) {
    dataToUpdate.address.zip = dataToUpdate.address.zipCode;
    delete dataToUpdate.address.zipCode;
  }

  if (images.length > 0) {
    const imageData = images.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }));
    dataToUpdate.images = [...(property.images || []), ...imageData];
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    dataToUpdate,
    { new: true, runValidators: true }
  )
    .populate("createdBy", "name email")
    .lean();

  return transformProperty(updatedProperty);
};

export const deleteProperty = async (propertyId, userId, userRole) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("Imóvel não encontrado");
  }

  if (property.createdBy.toString() !== userId.toString() && userRole !== "admin") {
    throw new Error("Você não tem permissão para excluir este imóvel");
  }

  await Property.findByIdAndDelete(propertyId);
  return { message: "Imóvel excluído com sucesso" };
};
