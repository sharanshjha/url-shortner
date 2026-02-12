const PRODUCTION_BACKEND_URL = "https://url-shortner-1-oebd.onrender.com";
const DEFAULT_API_BASE_URL = import.meta.env.DEV ? "http://localhost:3000" : PRODUCTION_BACKEND_URL;

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

export const PUBLIC_APP_URL = (import.meta.env.VITE_PUBLIC_APP_URL || API_BASE_URL).replace(/\/+$/, "");
