from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
import logging
from server.db.main import connect_to_db
from dotenv import load_dotenv

# Import routers
from server.routers import ai_router, user_router, transaction_router, financial_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

items = []


app = FastAPI()


# CORS for local development: allow frontend origins and POST/GET, etc.

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


# Include routers with proper prefixes and tags
def configure_routers(app: FastAPI):
    """Include routers with proper prefixes and tags."""
    # you can add more routers here
    app.include_router(user_router, prefix="/users", tags=["Users"])
    app.include_router(transaction_router, prefix="/transactions")
    app.include_router(financial_router, prefix="/financial")
    app.include_router(ai_router, prefix="/ai", tags=["AI"])

    # Print configured routes
    logger.info(
        f"routes configured : \n" + "\n".join([f"   {i}" for i in app.routes])
    )  # app.routes


configure_routers(app)


@app.get("/")
def read_root():
    return {"message": "Hello, world!"}


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
