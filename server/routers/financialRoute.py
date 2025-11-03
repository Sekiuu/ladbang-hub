from fastapi import HTTPException, APIRouter
from db.models import Financial
from schemes import FinancialBase

import logging

financial_router = APIRouter(tags=["Financial"])

logger = logging.getLogger(__name__)

@financial_router.post("/")
async def create_financial_settings(financial_data: FinancialBase):
    try:
        financial_record = await Financial.create(
            user_id=financial_data.user_id,
            daily_spending_limit=financial_data.daily_spending_limit,
            monthly_income=financial_data.monthly_income,
            notify_over_budget=financial_data.notify_over_budget,
            notify_low_saving=financial_data.notify_low_saving,
            goal_description=financial_data.goal_description,
            conclusion_routine=financial_data.conclusion_routine,
        )
        logger.info(f"Successfully created financial settings for user {financial_data.user_id}")
        return financial_record
    except Exception as e:
        logger.error(f"Error creating financial settings for user {financial_data.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@financial_router.get("/{user_id}")
async def get_financial_settings(user_id: str):
    try:
        record = await Financial.get(user_id=user_id)
        if not record:
            raise HTTPException(status_code=404, detail="Financial settings not found")

        logger.info(f"Successfully retrieved financial settings for user {user_id}")
        return record
    except Exception as e:
        logger.error(f"Error retrieving financial settings for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@financial_router.put("/{user_id}")
async def update_financial_settings(user_id: str, financial_data: FinancialBase):
    try:
        record = await Financial.get(user_id=user_id)
        if not record:
            raise HTTPException(status_code=404, detail="Financial settings not found")

        await record.update_or_create(
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


@financial_router.delete("/{user_id}")
async def delete_financial_settings(user_id: str):
    try:
        record = await Financial.get(user_id=user_id)
        if not record:
            raise HTTPException(status_code=404, detail="Financial settings not found")

        await record.delete()
        logger.info(f"Successfully deleted financial settings for user {user_id}")
        return {"message": "Financial settings deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting financial settings for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
