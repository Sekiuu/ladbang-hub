from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from pydantic import BaseModel
import logging
from db.main import connect_to_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

items = []


app = FastAPI()


# CORS for local development: allow frontend origins and POST/GET, etc.
from dotenv import load_dotenv

load_dotenv()

frontend_env = os.getenv("FRONTEND_URL")
if frontend_env:
    _stripped = frontend_env.strip("[").strip("]")
    origins = [
        o.strip().strip("'").strip('"') for o in _stripped.split(",") if o.strip()
    ]
else:
    origins = []
logger.info(f"CORS origins configured: {origins}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# db connect
connect_to_db(app=app)

# Import routers
from routers import ai_router, user_router

# Include routers with proper prefixes and tags
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])

logger.info(
    f"routes configured : \n" + "\n".join([f"   {i}" for i in app.routes])
)  # app.routes


@app.get("/")
def read_root():
    return {"message": "Hello, world!"}


@app.get("/test")
def get_test():
    """
    This is a test endpoint. It returns a JSON object with a body property.
    return as type ResponseData
    body: JSON
    message: str
    success: bool
    """
    # print("test")
    return {
        "body": {"name": "myname is test1"},
        "message": "this is a test!",
        "success": True,
    }


@app.get("/test2")
def get_test2():
    """
    This is a test endpoint. It returns a JSON object with a body property.
    return as type ResponseData
    body: JSON
    message: str
    success: bool
    """
    # print("test")
    return {
        "body": {"name": "myname is test2"},
        "message": "this is a test! but two",
        "success": True,
    }


class Item(BaseModel):  # create item model -> it like a schema or type of data
    item: str


@app.post("/item")
def create_item(item: Item):
    """
    This is a test endpoint. It returns a JSON object with a body property.
    return as type ResponseData
    body: JSON
    message: str
    success: bool
    """
    # print("test")
    items.append(item.item)
    return {"message": "create item success", "body": items, "success": True}


@app.get("/item")
def read_item():
    # return {
    #     "body": [
    #         {"id": idx, "item_name": item}
    #         for idx, item in enumerate(items)  # return as list of items json
    #     ],
    #     "message": "get item success",
    #     "success": True,
    # }
    return {
        "body": items,
        "message": "get item success",
        "success": True,
    }


if __name__ == "__main__":
    """
    This is the main entry point of the application. It starts the Uvicorn server
    on port 8000 and prints a message to the console.
    """

    PORT = int(os.getenv("PORT", 8000))
    config = uvicorn.Config(app=app, port=PORT)
    server = uvicorn.Server(config)
    server.run()
    # uvicorn.run(app=app, port=8000)
