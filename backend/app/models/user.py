from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    photo_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    subscription = relationship("Subscription", uselist=False, back_populates="user")
    bots = relationship("Bot", back_populates="user")
    sessions = relationship("Session", back_populates="user")

    def __repr__(self):
        return f"<User {self.username}>"
