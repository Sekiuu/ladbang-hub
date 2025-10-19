from google import genai
from google.genai import types
import os
from fastapi import APIRouter

ai_router = APIRouter()

from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(GEMINI_API_KEY)

client = genai.Client(api_key=GEMINI_API_KEY)

ai_router.get("/ai-promt")
def ai_promt(promt: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=promt,
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
        ),
    )
    print(response.text)
    return {"response": response.text}
