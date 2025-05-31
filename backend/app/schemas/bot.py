from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime
from .base import BaseSchema, TimestampMixin, IDMixin

class ProxySettings(BaseModel):
    enabled: bool = Field(default=False, description="Enable proxy for this bot")
    type: Optional[str] = Field(None, description="Proxy type (socks4, socks5, http)")
    host: Optional[str] = Field(None, description="Proxy host address")
    port: Optional[int] = Field(None, description="Proxy port number")
    username: Optional[str] = Field(None, description="Proxy authentication username")
    password: Optional[str] = Field(None, description="Proxy authentication password")

class PromotionSettings(BaseModel):
    message_template: str = Field(default="", description="Template for promotion messages")
    target_groups: List[str] = Field(default_factory=list, description="List of target group usernames/ids")
    interval: int = Field(default=3600, description="Interval between promotions in seconds")
    enabled: bool = Field(default=False, description="Enable automated promotions")

class BotStatus(BaseModel):
    status: str = Field(..., description="Bot status (online, offline, restarting, error)")
    uptime: Optional[str] = Field(None, description="Bot uptime duration")
    last_activity: Optional[str] = Field(None, description="Last activity timestamp")

class BotBase(BaseSchema):
    name: str = Field(..., min_length=3, max_length=64, description="Bot name")
    status: str = Field(default="offline", description="Bot status")
    uptime: Optional[str] = None
    last_activity: Optional[str] = None

class BotCreate(BotBase):
    phone_number: str = Field(..., description="Phone number for Telegram account")
    api_id: str = Field(..., description="Telegram API ID")
    api_hash: str = Field(..., description="Telegram API Hash")
    proxy_settings: Optional[ProxySettings] = None
    promotion_settings: Optional[PromotionSettings] = None

class BotUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=64)
    status: Optional[str] = None
    proxy_settings: Optional[ProxySettings] = None
    promotion_settings: Optional[PromotionSettings] = None
    uptime: Optional[str] = None
    last_activity: Optional[str] = None

class BotResponse(BotBase, IDMixin, TimestampMixin):
    user_id: int = Field(..., description="Owner user ID")
    phone_number: Optional[str] = None
    api_id: Optional[str] = None
    api_hash: Optional[str] = None
    proxy_enabled: bool = False
    proxy_type: Optional[str] = None
    proxy_host: Optional[str] = None
    proxy_port: Optional[int] = None
    proxy_username: Optional[str] = None
    promotion_settings: Optional[Dict[str, Any]] = None

class BotStatusUpdate(BaseModel):
    status: str = Field(..., description="New bot status")
    uptime: Optional[str] = None
    last_activity: Optional[str] = None

class BotWithToken(BotResponse):
    token: str = Field(..., description="Bot token (encrypted)")

class BotList(BaseModel):
    total: int
    items: list[BotResponse]

# Export all models
__all__ = [
    "ProxySettings",
    "PromotionSettings",
    "BotStatus",
    "BotBase",
    "BotCreate",
    "BotUpdate",
    "BotResponse",
    "BotStatusUpdate",
    "BotWithToken",
    "BotList"
]
