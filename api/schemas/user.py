# -*- coding: utf-8 -*-

from typing import Optional, Union, Literal
from pydantic import BaseModel, EmailStr, Field, UUID4


class UserCreate(BaseModel):
    login: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    username: EmailStr
    password: str = Field(..., min_length=8)


class User(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    avatar_id: Optional[Union[UUID4, Literal["delete"]]]
    password: Optional[str] = Field(..., min_length=8)

    class Config:
        check_fields = False