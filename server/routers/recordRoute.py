from fastapi import HTTPException, APIRouter
from db.models import Record
from pydantic import BaseModel
import logging
import datetime

from schemes import RecordBase


# Configure logging
logger = logging.getLogger(__name__)

# Initialize router with tags for documentation
record_router = APIRouter(tags=["Records"])

@record_router.post("/")
async def create_record(record_data: RecordBase):
    try:
        record = await Record.create(
            user_id = record_data.user_id,
            amout = record_data.amout,
            type = record_data.type,
            detail = record_data.detail,
            tag = record_data.tag,
        )
        logger.info(f"Record created successfully: {record}")
        return record
    except Exception as e:
        logger.error(f"Error creating record: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@record_router.get("/")
async def get_records():
    try:
        records = await Record.all()
        logger.info(f"Successfully retrieved {len(records)} records from database")
        return records
    except Exception as e:
        logger.error(f"Error retrieving records: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    

@record_router.get("/{record_id}")
async def get_record(record_id: str):
    try:
        record = await Record.get(id=record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")

        logger.info(f"Successfully retrieved record {record_id}")
        return record
    except Exception as e:
        logger.error(f"Error retrieving record {record_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@record_router.put("/{record_id}")
async def update_record(record_id: str, record_data: RecordBase):
    try:
        record = await Record.get(id=record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")

        await record.update_or_create(
            user_id = record_data.user_id,
            amout = record_data.amout,
            type = record_data.type,
            detail = record_data.detail,
            tag = record_data.tag,
        )
        logger.info(f"Successfully updated record {record_id}")
        return record
    except Exception as e:
        logger.error(f"Error updating record {record_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@record_router.delete("/{record_id}")
async def delete_record(record_id: str):
    try:
        record = await Record.get(id=record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")

        await record.delete()
        logger.info(f"Successfully deleted record {record_id}")
        return {"message": "Record deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting record {record_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
