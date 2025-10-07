import axios from "axios";

export type ResponseData = {
    body: JSON;
    message: string;
    success: boolean;
}

const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
export async function api(path : string): Promise<ResponseData | null> {
    try {
        const response = await axios.get<ResponseData>(backendUrl + path);
        const data = response.data;
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}