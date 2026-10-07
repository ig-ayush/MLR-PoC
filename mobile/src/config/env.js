const apiBaseUrl = (
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://10.0.2.2:4000"
).replace(/\/+$/, "");

export const API_BASE_URL = apiBaseUrl;
export const SOCKET_URL = apiBaseUrl;
