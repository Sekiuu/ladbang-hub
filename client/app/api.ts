import axios from "axios";

export type ResponseData = {
  body: JSON;
  message: string;
  success: boolean;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
console.log("heheha: "+ backendUrl);
// Simple, typed GET helper with optional query params
export async function apiGet(
  path: string,
  params?: Record<string, unknown>
): Promise<ResponseData | null> {
  try {
    const response = await axios.get<ResponseData>(backendUrl + path, {
      params,
    });
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Simple, typed POST helper with optional JSON payload
export async function apiPost(
  path: string,
  payload?: unknown
): Promise<ResponseData | null> {
  try {
    const response = await axios.post<ResponseData>(backendUrl + path, payload);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Convenient object-style usage: apiClient.get(...) / apiClient.post(...)
export const api = {
  get: apiGet,
  post: apiPost,
};
