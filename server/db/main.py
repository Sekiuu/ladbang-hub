import os
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def connect_to_db(app: FastAPI):
    DB_URL = os.getenv("DB_URL")

    if not DB_URL:
        logger.error("CRITICAL: DB_URL is not set in environment variables.")
        return

    logger.info(f"Raw DB_URL received: {DB_URL[:50]}...")

    try:
        # Clean and normalize the database URL
        DB_URL = DB_URL.strip().strip("'").strip('"')

        # Parse the URL into components
        parsed = urlparse(DB_URL)

        # Convert postgresql:// to postgres:// (Tortoise expects this)
        scheme = "postgres" if parsed.scheme.lower() in ["postgresql", "postgres"] else parsed.scheme

        # Parse query parameters
        query_params = parse_qs(parsed.query)

        # Define Tortoise ORM supported parameters
        tortoise_supported_params = {
            "ssl", "minsize", "maxsize", "max_queries",
            "max_inactive_connection_lifetime", "schema",
        }

        # Parameter mappings for Tortoise compatibility
        param_mappings = {"sslmode": "ssl"}

        # Filter and map parameters
        filtered_params = {}
        for key, values in query_params.items():
            key_lower = key.lower()
            if key_lower in param_mappings:
                key = param_mappings[key_lower]
            if key.lower() in tortoise_supported_params:
                filtered_params[key] = values[0] if values else ""

        # Reconstruct the URL
        new_query = urlencode(filtered_params)
        
        tortoise_db_url = urlunparse(
            (scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment)
        )
        logger.info(f"Successfully parsed and converted DB_URL.")

    except Exception as e:
        logger.error("CRITICAL: Failed to parse or convert the DB_URL.")
        logger.error(f"Error details: {e}")
        logger.error(traceback.format_exc())
        # Stop execution if parsing fails, as register_tortoise will fail anyway
        return

    try:
        logger.info(f"Attempting to connect with Tortoise using URL: {tortoise_db_url[:50]}...")
        register_tortoise(
            app=app,
            db_url=tortoise_db_url,
            modules={"models": ["db.models"]},
            generate_schemas=True,
            add_exception_handlers=True,
        )
        logger.info("Database connection successful")
    except Exception as e:
        logger.error(f"CRITICAL: Failed to register Tortoise ORM and connect to the database.")
        logger.error(f"Error details: {e}")
        logger.error(traceback.format_exc())
        # Re-raise the exception to ensure the startup failure is clear
        raise e
