import os
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def connect_to_db(app: FastAPI):
    # dotenv.load_dotenv()
    DB_URL = os.getenv("DB_URL")

    def convert_db_url_to_tortoise_suported():
        """
        Converts the provided database URL (DB_URL) to a format supported by Tortoise ORM.

        - Normalizes the DB_URL by stripping whitespace and quotes.
        - Converts the scheme to 'postgres' if it is 'postgresql' or 'postgres', as required by Tortoise.
        - Filters and maps the query parameters to only include those supported by Tortoise ORM.
        - Reconstructs and returns the compatible database URL string.

        Returns:
            str: The database URL formatted for Tortoise ORM usage, or None if DB_URL is not set.
        """
        nonlocal DB_URL
        # Clean and normalize the database URL
        DB_URL = DB_URL.strip().strip("'").strip('"')

        # Parse the URL into components
        parsed = urlparse(DB_URL)

        # Convert postgresql:// to postgres:// (Tortoise expects this)
        if parsed.scheme.lower() in ["postgresql", "postgres"]:
            scheme = "postgres"
        else:
            scheme = parsed.scheme

        # Parse query parameters
        query_params = parse_qs(parsed.query)

        # Define Tortoise ORM supported parameters
        tortoise_supported_params = {
            "ssl",
            "minsize",
            "maxsize",
            "max_queries",
            "max_inactive_connection_lifetime",
            "schema",
        }

        # Parameter mappings for Tortoise compatibility
        param_mappings = {
            "sslmode": "ssl",  # Map sslmode to ssl
        }

        # Filter and map parameters
        filtered_params = {}
        for key, values in query_params.items():
            key_lower = key.lower()

            # Apply parameter mappings
            if key_lower in param_mappings:
                key = param_mappings[key_lower]

            # Only keep supported parameters
            if key.lower() in tortoise_supported_params:
                filtered_params[key] = values[0] if values else ""

        # Reconstruct the URL
        new_query = urlencode(filtered_params) if filtered_params else ""

        DB_URL = urlunparse(
            (
                scheme,
                parsed.netloc,
                parsed.path,
                parsed.params,
                new_query,
                parsed.fragment,
            )
        )

    if DB_URL:
        convert_db_url_to_tortoise_suported()

        logger.info(f"Database URL configured: {DB_URL[:50]}...")

        try:
            register_tortoise(
                app=app,
                db_url=DB_URL,
                modules={"models": ["db.models"]},
                generate_schemas=True,
                add_exception_handlers=True,
            )
            logger.info("Database connection successful")
        except Exception as e:
            logger.error(f"Failed to register Tortoise ORM: {e}")
            return
    else:
        logger.error("DB_URL is not set in environment variables.")
        return
