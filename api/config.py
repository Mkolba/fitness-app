# -*- coding: utf-8 -*-
from dotenv import load_dotenv
from utils import BetterDict
import os

load_dotenv('../env')

database = BetterDict({
    'host': os.getenv('DB_HOST', ''),
    'database': os.getenv('DB_NAME', ''),
    'user': os.getenv('DB_USER', ''),
    'password': os.getenv('DB_PASSWORD', '')
})

if not database.host or not database.database or not database.user or not database.password:
    raise ValueError('Database connection data not specified')

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{database.user}:{database.password}@{database.host}/{database.database}"

SECRET_KEY = os.getenv('SECRET_KEY', '')

if not SECRET_KEY:
    raise ValueError('SECRET_KEY not specified')

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60