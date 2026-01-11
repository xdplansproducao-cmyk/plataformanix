import User from "../models/User.js";

export const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const users = await User.find()
    .select("-passwordHash")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments();

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  return user;
};

export const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select("-passwordHash");

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
};
