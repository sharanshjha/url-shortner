export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const PUBLIC_APP_URL = (import.meta.env.VITE_PUBLIC_APP_URL || API_BASE_URL).replace(/\/+$/, "");
