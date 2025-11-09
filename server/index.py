from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from mangum import Mangum
import traceback

from db.main import connect_to_db
from dotenv import load_dotenv

# Import routers
from routers import ai_router, user_router, transaction_router, usersetting_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
STARTUP_ERROR = None

# CORS configuration
load_dotenv()

frontend_env = os.getenv("FRONTEND_URL")
logger.info(f"FRONTEND_URL: {frontend_env}")

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
try:
    logger.info("Attempting to connect to the database during startup...")
    connect_to_db(app=app)
    logger.info("Database connection wrapper passed startup.")
except Exception:
    STARTUP_ERROR = traceback.format_exc()
    logger.error(f"Captured startup error: {STARTUP_ERROR}")

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

# @app.get("/")
@app.get("/")
def read_root():
    if STARTUP_ERROR:
        return {
            "status": "APPLICATION_STARTUP_ERROR",
            "error_details": STARTUP_ERROR,
        }
    return {"message": "FastAPI is running on Vercel", "status": "ok"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Mangum handler for Vercel serverless
handler = Mangum(app, lifespan="off")