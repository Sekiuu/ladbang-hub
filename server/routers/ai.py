from google import genai
from google.genai import types
import os
from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from dotenv import load_dotenv
from server.db.models import Transactions, User
import json
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


async def analyze_transaction_from_image(image_data: list, user_id: str):
    """
    Analyzes an image of a receipt and returns transaction data as JSON.
    """
    if not client:
        raise HTTPException(status_code=500, detail="AI service not configured")

    # The prompt instructs the model on how to analyze the image and what JSON to return.
    # It's crucial to be specific about the desired JSON structure.
    prompt = f"""
    Analyze the attached image(s) of a receipt. Extract the following details
    and return them as Array of JSON and return only the JSON array.
    the JSON object should have the following structure:
    
    - "amount": The total amount of the transaction as a float, defaulting to 0.
    - "type": The type of transaction, which should be "expense".
    - "detail": A brief description of the items or service.
    - "tag": A relevant category for the expense (e.g., "food", "transportation", "groceries").
    - "user_id": Use the provided user ID: "{user_id}".

    If you cannot determine a value, use a sensible default or null.
    The final output should be only the JSON object, with no other text or formatting.
    """

    # Combine the text prompt with the image data for the multimodal request
    model_input = [prompt, *image_data]

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=model_input
        )
        # The response text should be a JSON string. To make it more robust,
        # we'll clean it up in case the model wraps it in markdown.
        response_text = response.text
        logger.info(f"AI analysis response: {response_text}")
        # Find the start and end of the JSON object
        json_start = response_text.find("[")
        json_end = response_text.rfind("]") + 1
        json_string = response_text[json_start:json_end]
        transactions_data = json.loads(json_string)
        # for item in transactions_data:
        #     item["user_id"] = user_id
        # logger.info(f"AI analysis result: {transactions_data}")
        return transactions_data

    except Exception as e:
        logger.error(f"Error during AI analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")


@ai_router.get("/analyze-transaction")
async def ai_analyze(user_id: str):
    """
    Analyzes text data and returns response from AI.
    """
    transactions = (
        await Transactions.all()
        .filter(user_id=user_id)
        .values("amount", "type", "detail", "tag", "created_at")
    )

    user = await User.get(id=user_id)
    logger.info(f"Successfully retrieved user {user_id}")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not client:
        raise HTTPException(status_code=500, detail="AI service not configured")

    if not transactions:
        raise HTTPException(
            status_code=404, detail="No transactions found for analysis"
        )

    prompt = "\n".join(
        [
            f"{[t['amount']]}, {t['type']}, {t['detail']}, {t['tag']}, {t['created_at']}"
            for t in transactions
        ]
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"""
            วิเคราะห์ข้อมูลการเงินของ {user.username} และให้คำแนะนำการบริหารการเงินแบบสั้น ๆ

ข้อมูลรายการธุรกรรม:
{prompt}

กรุณาสรุปผลในรูปแบบ Markdown โดยใช้โครงสร้างดังนี้:

## 📊 สรุปการเงิน
- ภาพรวมสั้น ๆ ของพฤติกรรมการใช้จ่าย

## 💡 ข้อสังเกตสำคัญ
- 3-5 ข้อสังเกตที่สำคัญ

## ✅ คำแนะนำ
- 3-5 คำแนะนำที่นำไปใช้ได้จริง

เน้นความกระชับและเป็นมืออาชีพ ใช้อีโมจิน้อย ๆ มุ่งไปที่ข้อมูลที่สำคัญที่สุดเท่านั้น
            """,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_budget=0
                )  # Disables thinking
            ),
        )
        logger.info(f"AI text analysis response: {response.text}")
        return response.text

    except Exception as e:
        logger.error(f"Error during AI text analysis: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"AI text analysis failed: {str(e)}"
        )


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


@ai_router.post("/analyze-receipt")
async def analyze_receipt(image: UploadFile = File(...), user_id: str = Form(...)):
    """
    Upload receipt image and extract transaction data using AI
    """
    if not client:
        raise HTTPException(status_code=500, detail="AI service not configured")

    try:
        # Read image file
        image_bytes = await image.read()

        # Convert to base64 for Gemini API
        image_data = [
            types.Part.from_bytes(
                data=image_bytes, mime_type=image.content_type or "image/jpeg"
            )
        ]

        # Analyze using AI
        transactions = await analyze_transaction_from_image(image_data, user_id)

        logger.info(f"Successfully analyzed receipt for user {user_id}")
        return transactions

    except Exception as e:
        logger.error(f"Error analyzing receipt: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Receipt analysis failed: {str(e)}"
        )
