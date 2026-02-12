import User from "../models/user.model.js";

export const findUserByEmail = async (email, options = {}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const query = User.findOne({ email: normalizedEmail });

  if (options.includePassword) {
    query.select("+password");
  }

  return query;
};

export const findUserById = async (id) => User.findById(id);

export const createUser = async (name, email, password) => {
  const newUser = new User({ name, email, password });
  await newUser.save();
  return newUser;
};
