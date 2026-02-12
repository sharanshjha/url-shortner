import axiosInstance from "../utils/axiosInstance";

export const createShortUrl = async ({ url, slug, expiresAt }) => {
  const payload = {
    url,
    ...(slug ? { slug } : {}),
    ...(expiresAt ? { expiresAt } : {}),
  };

  const { data } = await axiosInstance.post("/api/v1/urls", payload);
  return data;
};

export const deleteShortUrl = async (id) => {
  const { data } = await axiosInstance.delete(`/api/v1/urls/${id}`);
  return data;
};
