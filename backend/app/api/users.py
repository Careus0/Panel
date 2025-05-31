from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..core.database import get_db
from ..middleware.auth import get_current_active_user
from ..middleware.rate_limiter import api_rate_limiter
from ..schemas.user import UserProfile, UserUpdate, UserResponse
from ..models.user import User
from ..models.bot import Bot
from ..models.subscription import Subscription

router = APIRouter()

@router.get("/profile", response_model=UserProfile, dependencies=[Depends(api_rate_limiter)])
async def get_user_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> UserProfile:
    """
    Get current user's profile with subscription and bot statistics
    """
    # Get bot counts
    total_bots = db.query(func.count(Bot.id)).filter(Bot.user_id == current_user.id).scalar()
    active_bots = db.query(func.count(Bot.id)).filter(
        Bot.user_id == current_user.id,
        Bot.status == "online"
    ).scalar()
    
    # Get subscription if exists
    subscription = None
    if current_user.subscription_id:
        subscription = db.query(Subscription).filter(
            Subscription.id == current_user.subscription_id
        ).first()
    
    # Create profile response
    profile = UserProfile(
        id=current_user.id,
        telegram_id=current_user.telegram_id,
        username=current_user.username,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        photo_url=current_user.photo_url,
        is_active=current_user.is_active,
        subscription_id=current_user.subscription_id,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
        subscription=subscription,
        bots_count=total_bots or 0,
        active_bots_count=active_bots or 0
    )
    
    return profile

@router.put("/profile", response_model=UserResponse, dependencies=[Depends(api_rate_limiter)])
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> UserResponse:
    """
    Update current user's profile
    """
    # Update user fields
    update_data = user_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse.model_validate(current_user)

@router.delete("/profile", dependencies=[Depends(api_rate_limiter)])
async def delete_user_account(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Delete current user's account and all associated data
    """
    # Delete all user's bots
    db.query(Bot).filter(Bot.user_id == current_user.id).delete()
    
    # Delete all user's sessions
    from ..models.session import Session as UserSession
    db.query(UserSession).filter(UserSession.user_id == current_user.id).delete()
    
    # Cancel subscription if exists
    if current_user.subscription_id:
        subscription = db.query(Subscription).filter(
            Subscription.id == current_user.subscription_id
        ).first()
        if subscription:
            subscription.status = "cancelled"
    
    # Delete user
    db.delete(current_user)
    db.commit()
    
    return {"message": "Account successfully deleted"}

@router.get("/me", response_model=UserResponse, dependencies=[Depends(api_rate_limiter)])
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
) -> UserResponse:
    """
    Get current user's basic information
    """
    return UserResponse.model_validate(current_user)
