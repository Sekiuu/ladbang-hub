from fastapi import HTTPException, APIRouter
from db.models import UsersSetting
from schemes import UserSettingBase

import logging

usersetting_router = APIRouter(tags=["Usersetting"])

logger = logging.getLogger(__name__)


@usersetting_router.post("/")
async def create_financial_settings(financial_data: UserSettingBase):
    try:
        financial_record = await UsersSetting.create(
            user_id=financial_data.user_id,
            daily_spending_limit=financial_data.daily_spending_limit,
            monthly_income=financial_data.monthly_income,
            notify_over_budget=financial_data.notify_over_budget,
            notify_low_saving=financial_data.notify_low_saving,
            goal_description=financial_data.goal_description,
            conclusion_routine=financial_data.conclusion_routine,
        )
        logger.info(
            f"Successfully created financial settings for user {financial_data.user_id}"
        )
        return financial_record
    except Exception as e:
        logger.error(
            f"Error creating financial settings for user {financial_data.user_id}: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@usersetting_router.get("/{user_id}")
async def get_financial_settings(user_id: str):
    try:
        record = await UsersSetting.all().filter(user_id=user_id).first()
        if not record:
            return {
                "message": "Financial settings not found",
                "body": HTTPException(
                    status_code=404, detail="Financial settings not found"
                ),
                "success": False,
            }
        logger.info(f"Successfully retrieved financial settings for user {user_id}")
        return {
            "message": "Financial settings retrieved successfully",
            "body": record,
            "success": True,
        }
    except Exception as e:
        logger.error(
            f"Error retrieving financial settings for user {user_id}: {str(e)}"
        )
        raise {
            "message": "Financial settings not found",
            "body": HTTPException(status_code=500, detail=f"Database error: {str(e)}"),
            "success": False,
        }


@usersetting_router.put("/{user_id}")
async def update_financial_settings(user_id: str, financial_data: UserSettingBase):
    try:
        record = await UsersSetting.get(user_id=user_id)
        if not record:
            raise HTTPException(status_code=404, detail="Financial settings not found")
        logger.info(f"Updating financial settings for user : {record.user_id}")
        await record.select_for_update().update(
            daily_spending_limit=financial_data.daily_spending_limit,
            monthly_income=financial_data.monthly_income,
            notify_over_budget=financial_data.notify_over_budget,
            notify_low_saving=financial_data.notify_low_saving,
            goal_description=financial_data.goal_description,
            conclusion_routine=financial_data.conclusion_routine,
        )
        logger.info(f"Successfully updated financial settings for user {user_id}")
        return {"message": "Financial settings updated successfully"}
    except Exception as e:
        logger.error(f"Error updating financial settings for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@usersetting_router.delete("/{user_id}")
async def delete_financial_settings(user_id: str):
    try:
        record = await UsersSetting.get(user_id=user_id)
        if not record:
            raise HTTPException(status_code=404, detail="Financial settings not found")

        await record.delete()
        logger.info(f"Successfully deleted financial settings for user {user_id}")
        return {"message": "Financial settings deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting financial settings for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
