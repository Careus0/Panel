from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class TelegramAuthData(BaseModel):
    id: int = Field(..., description="Telegram user ID")
    first_name: str = Field(..., description="User's first name")
    last_name: Optional[str] = Field(None, description="User's last name")
    username: Optional[str] = Field(None, description="User's username")
    photo_url: Optional[str] = Field(None, description="User's profile photo URL")
    auth_date: int = Field(..., description="Authentication timestamp")
    hash: str = Field(..., description="Authentication hash")

class TelegramLoginRequest(BaseModel):
    auth_data: Dict[str, Any] = Field(..., description="Telegram authentication data")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class LoginResponse(BaseModel):
    user: "UserResponse"
    token: TokenResponse

class LogoutRequest(BaseModel):
    token: str

# Forward reference resolution
from .user import UserResponse
LoginResponse.model_rebuild()
