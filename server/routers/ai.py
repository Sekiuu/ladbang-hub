from google import genai
from google.genai import types
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize router with tags for documentation
ai_router = APIRouter(tags=["AI"])

# Get API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    logger.info("GEMINI_API_KEY loaded successfully")
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    logger.error("ERR: GEMINI_API_KEY not found")
    client = None


class PromptRequest(BaseModel):
    prompt: str


@ai_router.get("/")
async def ai_root():
    """AI service root endpoint"""
    if not client:
        raise HTTPException(status_code=500, detail="AI service not configured")

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="I call u from my web-server api, so Say Hello To My users",
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_budget=0
                )  # Disables thinking
            ),
        )
        logger.info(f"AI prompt processed successfully")
        return {
            "message": "AI service is running successfully",
            "body": response.text,
            "success": True,
        }
    except Exception as e:
        logger.error(f"Error processing AI: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")


@ai_router.post("/prompt")
async def ai_prompt(request: PromptRequest):
    """Generate AI response using Gemini API"""
    if not client:
        raise HTTPException(status_code=500, detail="AI service not configured")

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=request.prompt,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_budget=0
                )  # Disables thinking
            ),
        )
        logger.info(f"AI prompt processed successfully")
        return {"message": response.text, "success": True}
    except Exception as e:
        logger.error(f"Error processing AI prompt: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")
