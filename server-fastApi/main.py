from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from pydantic import BaseModel

items = []
app = FastAPI()

# CORS for local development: allow frontend origins and POST/GET, etc.
from dotenv import load_dotenv

load_dotenv()
origins = (
    os.getenv("FRONTEND_URL").strip("[").strip("]").split(",")
    if os.getenv("FRONTEND_URL")
    else []
)
print(origins, type(origins))
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.get("/item/{item_id}")
def read_item(item_id: int):
    return {"id": item_id, "item_name": items[item_id]}


if __name__ == "__main__":
    """
    This is the main entry point of the application. It starts the Uvicorn server
    on port 8000 and prints a message to the console.
    """
    config = uvicorn.Config(app=app, port=8080)
    server = uvicorn.Server(config)
    server.run()
    # uvicorn.run(app=app, port=8000)
