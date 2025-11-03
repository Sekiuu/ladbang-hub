"""
Routers package for FastAPI application.

This package contains all the API routers that define the endpoints
for different parts of the application.
"""

from .ai import ai_router
from .userRoute import user_router
from .transactionRoute import transaction_router
from .usersettingRoute import usersetting_router

__all__ = ["ai_router", "user_router", "transaction_router", "usersetting_router"]
