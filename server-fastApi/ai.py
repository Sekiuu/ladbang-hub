def routeAi():
    from google import genai
    from google.genai import types
    import os
    import fastapi
    
    app = fastapi.FastAPI()
    
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    client = genai.Client(api_key=GEMINI_API_KEY)

    app.get("/ai-promt")
    def ai_promt():
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Explain how AI works in a few words",
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
            ),
        )
        print(response.text)
