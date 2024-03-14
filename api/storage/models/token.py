from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import func

from ..database import Base


class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(String)

    user = relationship("User", foreign_keys=[user_id], lazy='selectin')