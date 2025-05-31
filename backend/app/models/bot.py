from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Bot(Base):
    __tablename__ = "bots"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, default="offline")  # online, offline, restarting, error
    
    # Telethon Authentication
    phone_number = Column(String, unique=True)
    api_id = Column(String)
    api_hash = Column(String)
    session_string = Column(Text)  # Store Telethon session string
    
    # Proxy Configuration
    proxy_enabled = Column(Boolean, default=False)
    proxy_type = Column(String)  # socks4, socks5, http
    proxy_host = Column(String)
    proxy_port = Column(Integer)
    proxy_username = Column(String, nullable=True)
    proxy_password = Column(String, nullable=True)
    
    # Promotion Settings
    promotion_settings = Column(JSON, default={
        "message_template": "",
        "target_groups": [],
        "interval": 3600,  # Default 1 hour
        "enabled": False
    })
    
    # Bot Status
    uptime = Column(String)  # e.g., "2 days", "5 hours"
    last_activity = Column(String)  # e.g., "2 minutes ago"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="bots")

    def __repr__(self):
        return f"<Bot {self.name}>"
