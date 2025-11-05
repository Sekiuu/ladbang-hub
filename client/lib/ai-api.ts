const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PromptRequest {
  prompt: string;
}

export interface PromptResponse {
  message: string;
  success: boolean;
}

export interface TransactionData {
  amount: number;
  type: string;
  detail: string;
  tag: string;
  user_id: string;
}

export async function testAIService(): Promise<{ message: string; body: string; success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/ai/`);
  if (!response.ok) {
    throw new Error(`AI service test failed: ${response.statusText}`);
  }
  return response.json();
}

export async function sendPromptToAI(prompt: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/ai/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`AI prompt failed: ${response.statusText}`);
  }

  const data: PromptResponse = await response.json();
  return data.message;
}


export async function analyzeUserTransactions(userId: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/ai/analyze-transaction?user_id=${userId}`);
  
  if (!response.ok) {
    throw new Error(`Transaction analysis failed: ${response.statusText}`);
  }

  return response.text();
}

export async function analyzeReceiptImage(
  imageFile: File,
  userId: string
): Promise<TransactionData[]> {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("user_id", userId);

  // Note: This endpoint needs to be implemented in FastAPI backend
  const response = await fetch(`${API_BASE_URL}/ai/analyze-receipt`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Receipt analysis failed: ${response.statusText}`);
  }

  return response.json();
}
