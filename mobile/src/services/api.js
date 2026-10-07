import axios from "axios";
import { API_BASE_URL } from "../config/env";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

export async function fetchLeads() {
  const response = await api.get("/api/leads");
  return response.data.data || [];
}

export default api;
