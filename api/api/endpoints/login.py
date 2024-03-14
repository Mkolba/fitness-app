import secrets
from datetime import timedelta
from typing import Annotated

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, Header

from storage.models import User, Token

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, delete

from api import deps
import security
import schemas
import config

router = APIRouter()


@router.post("/login", response_model=schemas.TokenPair)
async def login_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: AsyncSession = Depends(deps.get_db)) -> schemas.TokenPair:
    user = await db.execute(select(User).where(
        and_(User.login == form_data.username))
    )
    user = user.scalar()

    if not user or security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Неправильный логин или пароль")

    await db.execute(delete(Token).where(Token.user_id == user.id))
    refresh_token = Token(
        token=secrets.token_urlsafe(64),
        user_id=user.id,
    )
    db.add(refresh_token)
    await db.commit()

    token = await db.execute(select(Token).where(
        and_(Token.user_id == user.id)
    ))
    token = token.scalar()

    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    return schemas.TokenPair(
        access_token=security.create_access_token(user.id, expires_delta=access_token_expires),
        token_type="bearer",
        refresh_token=token.token
    )

@router.post("/refresh-access-token", response_model=schemas.TokenPair)
async def refresh_access_token(x_refresh_token: Annotated[str, Header()], db: AsyncSession = Depends(deps.get_db)) -> schemas.TokenPair:
    refresh_token = await db.execute(select(Token).where(
        and_(Token.token == x_refresh_token))
    )
    refresh_token = refresh_token.scalar()

    if not refresh_token:
        raise HTTPException(401, 'Refresh token expired')

    await db.delete(refresh_token)
    refresh_token = Token(
        token=secrets.token_urlsafe(64),
        user_id=refresh_token.user_id,
    )
    db.add(refresh_token)
    await db.commit()

    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    return schemas.TokenPair(
        access_token=security.create_access_token(refresh_token.user_id, expires_delta=access_token_expires),
        token_type="bearer",
        refresh_token=refresh_token.token
    )


@router.post('/register')
async def register(data: schemas.UserCreate, db: AsyncSession = Depends(deps.get_db)):

    user = User(
        login=data.login,
        hashed_password=security.get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name
    )

    db.add(user)

    try:
        await db.commit()
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Пользователь с таким логином уже существует")

    await db.refresh(user)

    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(user.id, expires_delta=access_token_expires)
    refresh_token = Token(
        token=secrets.token_urlsafe(64),
        user_id=user.id,
    )
    db.add(refresh_token)
    await db.commit()

    return schemas.TokenPair(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token.token
    )