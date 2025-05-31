from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .base import BaseSchema, TimestampMixin, IDMixin

class UserBase(BaseModel):
    telegram_id: str = Field(..., description="Telegram user ID")
    username: Optional[str] = Field(None, description="Telegram username")
    first_name: str = Field(..., description="User's first name")
    last_name: Optional[str] = Field(None, description="User's last name")
    photo_url: Optional[str] = Field(None, description="Profile photo URL")

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    photo_url: Optional[str] = None

class UserResponse(BaseSchema, IDMixin, UserBase, TimestampMixin):
    is_active: bool
    subscription_id: Optional[int] = None

class UserProfile(UserResponse):
    subscription: Optional["SubscriptionResponse"] = None
    bots_count: int = 0
    active_bots_count: int = 0

# Forward reference for subscription
from .subscription import SubscriptionResponse
UserProfile.model_rebuild()
