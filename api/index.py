from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from mangum import Mangum

# Set up paths to import from server directory
import sys
from pathlib import Path

# Add server directory to Python path
server_path = Path(__file__).parent.parent / "server"
sys.path.insert(0, str(server_path))

from server.db.main import connect_to_db
from dotenv import load_dotenv

# Import routers
from server.routers import ai_router, user_router, transaction_router, usersetting_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS configuration
load_dotenv()

frontend_env = os.getenv("FRONTEND_URL")
if frontend_env:
    _stripped = frontend_env.strip("[").strip("]")
    origins = [
        o.strip().strip("'").strip('"') for o in _stripped.split(",") if o.strip()
    ]
else:
    # Default to Vercel frontend
    origins = [
        "https://*.vercel.app",
        "http://localhost:3000",
    ]

logger.info(f"CORS origins configured: {origins}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# db connect
connect_to_db(app=app)

# Configure routers
def configure_routers(app: FastAPI):
    """Include routers with proper prefixes and tags."""
    app.include_router(user_router, prefix="/api/users", tags=["Users"])
    app.include_router(transaction_router, prefix="/api/transactions", tags=["Transactions"])
    app.include_router(usersetting_router, prefix="/api/usersettings", tags=["User Settings"])
    app.include_router(ai_router, prefix="/api/ai", tags=["AI"])
    
    logger.info(
        f"routes configured : \n" + "\n".join([f"   {i}" for i in app.routes])
    )

configure_routers(app)

@app.get("/")
@app.get("/api")
def read_root():
    return {"message": "FastAPI is running on Vercel", "status": "ok"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Mangum handler for Vercel serverless
handler = Mangum(app, lifespan="off")
