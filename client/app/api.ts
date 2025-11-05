import axios from "axios";

export type ResponseData = {
  body: any;
  message: string;
  success: boolean;
};

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
console.log("heheha: " + backendUrl);
// Simple, typed GET helper with optional query params
export async function apiGet(
  path: string,
  params?: Record<string, unknown>
): Promise<ResponseData | null> {
  try {
    const response = await axios.get<ResponseData>(backendUrl + path, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Simple, typed POST helper with optional JSON payload
export async function apiPost(
  path: string,
  payload?: unknown
): Promise<ResponseData | null> {
  try {
    // Ensure path ends with / to avoid redirects
    const normalizedPath = path.endsWith("/") ? path : path + "/";
    const response = await axios.post<ResponseData>(
      backendUrl + normalizedPath,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Convenient object-style usage: apiClient.get(...) / apiClient.post(...)
export const api = {
  get: apiGet,
  post: apiPost,
};
