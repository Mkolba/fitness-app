from fastapi import APIRouter

from .endpoints import login, messages, users, photos

api_router = APIRouter()
api_router.include_router(login.router, tags=["Авторизация"])
api_router.include_router(messages.router, tags=["Сообщения"], prefix='/messages')
"""
api_router.include_router(friends.router, tags=["Друзья"], prefix='/friends')
api_router.include_router(posts.router, tags=["Публикации"], prefix='/posts')
api_router.include_router(newsfeed.router, tags=["Лента"], prefix='/newsfeed')
api_router.include_router(photos.router, tags=["Фотографии"], prefix='/photos')"""