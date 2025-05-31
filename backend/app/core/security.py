import hashlib
import hmac
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .config import settings
from ..core.database import get_db
from ..models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Mock authentication for testing
    if token == "mocked_token_for_testing":
        # Create or get test user
        test_user = db.query(User).filter(User.telegram_id == "123456789").first()
        if not test_user:
            test_user = User(
                telegram_id="123456789",
                username="testuser",
                first_name="Test",
                last_name="User",
                is_active=True
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
        return test_user
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

def verify_telegram_auth(auth_data: Dict[str, Any]) -> bool:
    """
    Verify Telegram authentication data using HMAC-SHA256
    Based on Telegram's authentication verification algorithm
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        return False
    
    # Make a copy to avoid modifying the original data
    auth_data_copy = auth_data.copy()
    
    # Extract hash from auth_data copy
    received_hash = auth_data_copy.pop('hash', None)
    if not received_hash:
        return False
    
    # Create data check string
    data_check_arr = []
    for key, value in sorted(auth_data_copy.items()):
        data_check_arr.append(f"{key}={value}")
    data_check_string = '\n'.join(data_check_arr)
    
    # Create secret key from bot token
    secret_key = hashlib.sha256(settings.TELEGRAM_BOT_TOKEN.encode()).digest()
    
    # Calculate HMAC-SHA256
    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Compare hashes
    return hmac.compare_digest(calculated_hash, received_hash)

def verify_telegram_auth_date(auth_date: int, max_age_seconds: int = 86400) -> bool:
    """
    Verify that Telegram auth data is not too old
    Default max age is 24 hours (86400 seconds)
    """
    current_timestamp = int(datetime.utcnow().timestamp())
    return (current_timestamp - auth_date) <= max_age_seconds

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)
