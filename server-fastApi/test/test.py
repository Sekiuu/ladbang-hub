import fastapi
import uvicorn

app = fastapi.FastAPI()


@app.get("/test")
async def root():
    print("test")
    return {"message": "Hello, world!"}