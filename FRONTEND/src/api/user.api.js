import axiosInstance from "../utils/axiosInstance";

export const loginUser = async ({ email, password }) => {
  const { data } = await axiosInstance.post("/api/v1/auth/login", { email, password });
  return data;
};

export const registerUser = async ({ name, email, password }) => {
  const { data } = await axiosInstance.post("/api/v1/auth/register", { name, email, password });
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/api/v1/auth/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/api/v1/auth/me");
  return data;
};

export const getAllUserUrls = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await axiosInstance.get("/api/v1/urls/me", {
    params: { page, limit },
  });
  return data;
};
