from fastapi import APIRouter, Depends, HTTPException
from typing import List
from storage.models import User, Photo

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_

from api import deps
import schemas

router = APIRouter()

@router.get("/{user_id}")
async def test(
    current_user: User = Depends(deps.get_current_user),
):
    print(current_user.login)
    return {"cum": True}