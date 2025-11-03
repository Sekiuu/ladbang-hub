from typing import Any
from pydantic import BaseModel
from typing import Any


class UserBase(BaseModel):
    id: str
    username: str
    email: str
    password: str


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class TransactionBase(BaseModel):
    id: str
    user_id: str
    amout: float
    type: str
    detail: str
    tag: str  # income, expense


class UserSettingBase(BaseModel):
    user_id: str
    daily_spending_limit: float
    monthly_income: float
    notify_over_budget: bool
    notify_low_saving: bool
    goal_description: str
    conclusion_routine: str


class ResponseData(BaseModel):
    body: Any
    message: str
    success: bool


#   export type ResponseData = {
#   body: JSON;
#   message: string;
#   success: boolean;
# };
