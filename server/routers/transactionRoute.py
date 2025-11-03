from fastapi import HTTPException, APIRouter, File, UploadFile
from db.models import Transactions
from typing import List
from schemes import TransactionBase, TransactionCreate, ResponseData

# from pydantic import BaseModel
import logging
import io
import PIL.Image

# import datetime

from routers.ai import analyze_transaction_from_image

# Configure logging
logger = logging.getLogger(__name__)

# Initialize router with tags for documentation
transaction_router = APIRouter(tags=["Transactions"])


@transaction_router.get("/")
async def get_records():
    try:
        records = await Transactions.all()
        logger.info(f"Successfully retrieved {len(records)} records from database")
        return ResponseData(
            body=records, message="Records retrieved successfully", success=True
        )
    except Exception as e:
        logger.error(f"Error retrieving records: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@transaction_router.post("/")
async def create_record(record_data: TransactionCreate):
    try:
        record = await Transactions.create(
            user_id=record_data.user_id,
            amount=record_data.amount,
            type=record_data.type,
            detail=record_data.detail,
            tag=record_data.tag,
        )
        logger.info(f"Record created successfully: {record}")
        return ResponseData(
            body=record, message="Transaction created successfully", success=True
        )
    except Exception as e:
        logger.error(f"Error creating record: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@transaction_router.get("/{record_id}")
async def get_record(record_id: str):
    try:
        record = await Transactions.get(id=record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")

        logger.info(f"Successfully retrieved record {record_id}")
        return ResponseData(
            body=record, message="Record retrieved successfully", success=True
        )
    except Exception as e:
        logger.error(f"Error retrieving record {record_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@transaction_router.put("/{record_id}")
async def update_record(record_id: str, record_data: TransactionBase):
    try:
        record = await Transactions.get(id=record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")

        await record.update_or_create(
            user_id=record_data.user_id,
            amount=record_data.amount,
            type=record_data.type,
            detail=record_data.detail,
            tag=record_data.tag,
        )
        logger.info(f"Successfully updated record {record_id}")
        return record
    except Exception as e:
        logger.error(f"Error updating record {record_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@transaction_router.delete("/{record_id}")
async def delete_record(record_id: str):
    try:
        record = await Transactions.get(id=record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")

        await record.delete()
        logger.info(f"Successfully deleted record {record_id}")
        return {"message": "Record deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting record {record_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@transaction_router.post("/img-add")
async def create_record_with_image(
    user_id: str,
    images: List[UploadFile] = File(..., media_type="image"),
):
    """
    Accepts images, sends them to an AI for analysis, and creates a
    transaction record from the AI's JSON response.
    """
    if not images:
        raise HTTPException(status_code=400, detail="No images were uploaded.")

    # Prepare images for the AI model by reading their content
    image_parts = []
    for image_file in images:
        # Read image contents into memory
        contents = await image_file.read()
        # Use Pillow to open the image from bytes, which is what the
        # google-generativeai library expects.
        try:
            img = PIL.Image.open(io.BytesIO(contents))
            image_parts.append(img)
        except Exception as e:
            logger.error(f"Failed to process image {image_file.filename}: {e}")
            raise HTTPException(
                status_code=400, detail=f"Invalid image file: {image_file.filename}"
            )

    # Call the AI service to analyze the images and get structured data
    try:
        transaction_data = await analyze_transaction_from_image(image_parts, user_id)
        logger.info(f"AI analysis result: {transaction_data}")
        # Create the record in the database using the data from the AI
        records = []
        for item in transaction_data:
            item["user_id"] = user_id
            record = await Transactions.create(**item)
            records.append(record)
            logger.info(f"Record created successfully from AI data: {record.id}")
        return records
    except Exception as e:
        # This will catch errors from both the AI call and the database creation
        logger.error(f"Error creating record from image: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to process and save transaction: {str(e)}"
        )
