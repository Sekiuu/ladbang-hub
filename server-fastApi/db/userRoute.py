from fastapi import HTTPException, APIRouter
from models import User
import logging


# logging config
logger = logging.getLogger(__name__)

userRouter = APIRouter()

userRouter.get("/getAll")
async def get_users():
    try:
        users = await User.all()
        logger.info(f"Successfully retrieved {len(users)} users from database")
        return {
            "body": users,
            "message": f"Retrieved {len(users)} users from database",
            "success": True,
        }
    except Exception as e: #err catch
        logger.error(f"Error retrieving users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
