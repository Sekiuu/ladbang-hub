from fastapi import FastAPI
import uvicorn

items = []
app = FastAPI()

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
    return {"body": {"name":"myname is test1"}, "message": "this is a test!", "success": True}

@app.get('/test2')
def get_test2():
    """
    This is a test endpoint. It returns a JSON object with a body property.
    return as type ResponseData
    body: JSON
    message: str
    success: bool
    """
    # print("test")
    return {"body": {"name":"myname is test2"}, "message": "this is a test! but two", "success": True}

@app.get('/test3')
def get_test3():
    """
    This is a test endpoint. It returns a JSON object with a body property.
    return as type ResponseData
    body: JSON
    message: str
    success: bool
    """
    # print("test")
    return {"body": {"name":"myname is test3"}, "message": "this is a test! but three i naa hee", "success": True}

@app.post('/item')
def create_item(item: dict):
    """
    This is a test endpoint. It returns a JSON object with a body property.
    return as type ResponseData
    body: JSON
    message: str
    success: bool
    """
    # print("test")
    items.append(item)
    return {"message": "create item success", "success": True}

@app.get('/item/{item_id}')
def read_item(item_id: int):
    return {"item_id": item_id}

if __name__ == "__main__":
    """
    This is the main entry point of the application. It starts the Uvicorn server
    on port 8000 and prints a message to the console.
    """
    # config = uvicorn.Config(app=app,port=8000)
    # server = uvicorn.Server(config)
    # server.run()
    uvicorn.run(app=app, port=8000)
