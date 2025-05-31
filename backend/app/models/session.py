from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    user_agent = Column(String)  # Store client browser/app info
    ip_address = Column(String)  # Store client IP for security
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="sessions")

    def __repr__(self):
        return f"<Session {self.user_id}>"

    def is_valid(self) -> bool:
        """Check if session is valid and not expired"""
        return (
            self.is_active and 
            self.expires_at > datetime.utcnow()
        )

    def update_activity(self):
        """Update last activity timestamp"""
        self.last_activity = datetime.utcnow()
