import os
# import dotenv
import re
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
import logging
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
def connect_to_db(app:FastAPI):
    # dotenv.load_dotenv()
    DB_URL = os.getenv("DB_URL")
    if DB_URL:
        # Normalize DB scheme for Tortoise (it expects 'postgres://')
        DB_URL = DB_URL.strip().strip("'").strip('"')
        # Case-insensitive replace of a leading 'postgresql://' with 'postgres://'
        DB_URL = re.sub(r"^postgresql://", "postgres://", DB_URL, flags=re.IGNORECASE)
        
        # Remove SSL parameters that asyncpg doesn't support
        # Replace sslmode=require with ssl=require
        DB_URL = re.sub(r"sslmode=", "ssl=", DB_URL, flags=re.IGNORECASE)

        logger.info(f"Database URL configured: {DB_URL[:50]}...")
        
        register_tortoise(
            app=app,
            db_url=DB_URL,
            modules={"models": ["models"]},
            generate_schemas=True,
            add_exception_handlers=True,
        )
    else:
        logger.error("DB_URL environment variable is not set!")
        logger.warning("Using fallback SQLite database for testing")
        DB_URL = "sqlite://db.sqlite3"
        register_tortoise(
            app=app,
            db_url=DB_URL,
            modules={"models": ["models"]},
            generate_schemas=True,
            add_exception_handlers=True,
        )
