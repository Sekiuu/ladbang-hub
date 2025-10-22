from pydantic import BaseModel


class UserBase(BaseModel):
    id: str
    username: str
    email: str
    password: str


class ResponseData(BaseModel):
    body: any
    message: str
    success: bool


#   export type ResponseData = {
#   body: JSON;
#   message: string;
#   success: boolean;
# };
