from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from ..core.database import get_db
from ..core.security import verify_telegram_auth, verify_telegram_auth_date, create_access_token
from ..middleware.rate_limiter import auth_rate_limiter
from ..schemas.auth import TelegramLoginRequest, LoginResponse, LogoutRequest
from ..schemas.user import UserCreate, UserResponse
from ..models.user import User
from ..models.session import Session as UserSession

router = APIRouter()

@router.post("/telegram", response_model=LoginResponse, dependencies=[Depends(auth_rate_limiter)])
async def telegram_login(
    login_data: TelegramLoginRequest,
    db: Session = Depends(get_db)
) -> LoginResponse:
    """
    Authenticate user with Telegram login data
    """
    auth_data = login_data.auth_data
    
    # Verify Telegram authentication data
    if not verify_telegram_auth(auth_data):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication data"
        )
    
    # Verify auth_date is not too old
    auth_date = auth_data.get("auth_date")
    if not auth_date or not verify_telegram_auth_date(int(auth_date)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication data expired"
        )
    
    # Get or create user
    telegram_id = str(auth_data.get("id"))
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    
    if not user:
        # Create new user
        user_create = UserCreate(
            telegram_id=telegram_id,
            username=auth_data.get("username"),
            first_name=auth_data.get("first_name"),
            last_name=auth_data.get("last_name"),
            photo_url=auth_data.get("photo_url")
        )
        
        user = User(
            telegram_id=user_create.telegram_id,
            username=user_create.username,
            first_name=user_create.first_name,
            last_name=user_create.last_name,
            photo_url=user_create.photo_url
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update existing user data
        user.username = auth_data.get("username")
        user.first_name = auth_data.get("first_name")
        user.last_name = auth_data.get("last_name")
        user.photo_url = auth_data.get("photo_url")
        db.commit()
        db.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    # Create new session
    session = UserSession(
        user_id=user.id,
        token=access_token,
        expires_at=datetime.utcnow() + access_token_expires,
        user_agent=None,  # Add user agent if needed
        ip_address=None   # Add IP address if needed
    )
    db.add(session)
    db.commit()
    
    return LoginResponse(
        user=UserResponse.model_validate(user),
        token={"access_token": access_token, "token_type": "bearer", "expires_in": 1800}
    )

@router.post("/logout")
async def logout(
    logout_data: LogoutRequest,
    db: Session = Depends(get_db)
) -> dict:
    """
    Logout user and invalidate session
    """
    session = db.query(UserSession).filter(
        UserSession.token == logout_data.token,
        UserSession.is_active == True
    ).first()
    
    if session:
        session.is_active = False
        db.commit()
    
    return {"message": "Successfully logged out"}

@router.post("/refresh-token")
async def refresh_token(
    current_token: str,
    db: Session = Depends(get_db)
) -> dict:
    """
    Refresh access token
    """
    session = db.query(UserSession).filter(
        UserSession.token == current_token,
        UserSession.is_active == True
    ).first()
    
    if not session or not session.is_valid():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Create new access token
    access_token_expires = timedelta(minutes=30)
    new_token = create_access_token(
        data={"sub": str(session.user_id)},
        expires_delta=access_token_expires
    )
    
    # Update session
    session.token = new_token
    session.expires_at = datetime.utcnow() + access_token_expires
    db.commit()
    
    return {
        "access_token": new_token,
        "token_type": "bearer",
        "expires_in": 1800
    }
