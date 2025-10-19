from fastapi import HTTPException, APIRouter
from db.models import User
from pydantic import BaseModel
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Initialize router with tags for documentation
user_router = APIRouter(tags=["Users"])


@user_router.get("/")
async def get_users():
    """Get all users from the database"""
    try:
        users = await User.all()
        logger.info(f"Successfully retrieved {len(users)} users from database")
        return {
            "body": users,
            "message": f"Retrieved {len(users)} users from database",
            "success": True,
        }
    except Exception as e:
        logger.error(f"Error retrieving users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@user_router.get("/{user_id}", response_model=dict)
async def get_user(user_id: int):
    """Get a specific user by ID"""
    try:
        user = await User.get(id=user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        logger.info(f"Successfully retrieved user {user_id}")
        return {
            "body": user,
            "message": f"Retrieved user {user_id}",
            "success": True,
        }
    except Exception as e:
        logger.error(f"Error retrieving user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
