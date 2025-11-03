from fastapi import HTTPException, APIRouter
from db.models import User
from pydantic import BaseModel
import logging

from schemes import UserBase


class VerifyCredentials(BaseModel):
    email: str
    password: str


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
        return users
    except Exception as e:
        logger.error(f"Error retrieving users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@user_router.get("/{user_id}")
async def get_user(user_id: int):
    """Get a specific user by ID"""
    try:
        user = await User.get(id=user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        logger.info(f"Successfully retrieved user {user_id}")
        return user
    except Exception as e:
        logger.error(f"Error retrieving user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@user_router.post("/")
async def create_user(user_data: UserBase):
    """Create a new user"""
    try:
        # Check if user already exists
        existing_user = await User.filter(email=user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=400, detail="User with this email already exists"
            )

        existing_username = await User.filter(username=user_data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=400, detail="User with this username already exists"
            )

        # Create new user
        user = await User.create(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password,  # In production, hash this password
            created_at=User.created_at.default(),
        )

        logger.info(f"Successfully created user {user.username}")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# to verify users
@user_router.post("/verify")
async def verify_user(credentials: VerifyCredentials):
    """Verify user credentials for authentication"""
    try:
        user = await User.filter(email=credentials.email).first()
        if not user:
            return {
                "message": "Invalid Email",
                "body": None,
                "success": False,
            }
        # In production, use proper password hashing (bcrypt, etc.)
        if user.password != credentials.password:
            return {
                "message": "Invalid Password",
                "body": None,
                "success": False,
            }

        logger.info(f"Successfully verified user {user.username}")
        return {
            "message": "User verified",
            "body": UserBase(
                id=user.id,
                username=user.username,
                email=user.email,
                password=user.password,
            ),
            "success": True,
        }
    except Exception as e:
        logger.error(f"Error verifying user: {str(e)}")
        return {
            "message": "Server error",
            "body": None,
            "success": False,
        }
