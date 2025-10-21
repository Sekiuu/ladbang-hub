from email import message
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    id: str
    username: str
    email: str
    password: str


class ResponseData(BaseModel):
    body: dict
    message: str
    success: bool


#   export type ResponseData = {
#   body: JSON;
#   message: string;
#   success: boolean;
# };
