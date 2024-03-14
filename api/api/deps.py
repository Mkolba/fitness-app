from sqlalchemy import and_
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from typing import Union
from storage.database import SessionLocal, s3_session
from storage.models import User,  Photo
import schemas
import config
from traceback import format_exc

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/api/login/"
)

async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session


async def get_s3():
    async with s3_session.client('s3', endpoint_url='https://hb.bizmrg.com') as s3:
        yield s3


async def get_current_user(db: AsyncSession = Depends(get_db), token: str = Depends(reusable_oauth2)) -> User:
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        print(format_exc())
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = await db.execute(select(User).where(
        User.id == int(token_data.sub)
    ))
    user = user.scalar()
    if not user:
        raise HTTPException(401)
    return user


async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.execute(select(User).where(
        and_(User.id == user_id)
    ))
    user = user.scalar()
    if not user:
        raise HTTPException(404, 'Пользователя с таким ID не существует.')
    return user


"""async def get_photo(obj: Union[schemas.Message, None] = Body(None), db: AsyncSession = Depends(get_db)):
    if obj.photo:
        photo = await db.execute(select(Photo).where(
            Photo.id == obj.photo
        ))
        photo = photo.scalar()
        if not photo:
            raise HTTPException(404, 'Фотография не найдена')
        return photo"""