// AI API wrapper functions for Next.js client

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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

/**
 * Test AI service connection
 */
export async function testAIService(): Promise<{ message: string; body: string; success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/ai/`);
  if (!response.ok) {
    throw new Error(`AI service test failed: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Send a prompt to AI and get response
 */
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

/**
 * Get AI analysis of user's transactions
 */
export async function analyzeUserTransactions(userId: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze-transaction?user_id=${userId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Analysis error:', errorText);
      throw new Error(`Transaction analysis failed: ${response.statusText} - ${errorText}`);
    }

    return response.text();
  } catch (error) {
    console.error('Error analyzing transactions:', error);
    throw error;
  }
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
