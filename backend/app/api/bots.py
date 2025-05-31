from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.bot import Bot
from ..schemas.bot import (
    BotCreate, BotUpdate, BotResponse, BotList,
    ProxySettings, PromotionSettings
)
from ..services.telethon_service import telethon_service

router = APIRouter()

@router.post("/bots", response_model=BotResponse)
async def create_bot(
    bot_data: BotCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new userbot"""
    # Start authentication process
    auth_result = await telethon_service.authenticate_bot(
        bot_id=0,  # Temporary ID until bot is created
        phone_number=bot_data.phone_number,
        api_id=bot_data.api_id,
        api_hash=bot_data.api_hash,
        proxy_config=bot_data.proxy_settings.dict() if bot_data.proxy_settings else None
    )
    
    if auth_result["status"] == "error":
        raise HTTPException(status_code=400, detail=auth_result["message"])
    
    # Create bot in database
    bot = Bot(
        user_id=current_user.id,
        name=bot_data.name,
        phone_number=bot_data.phone_number,
        api_id=bot_data.api_id,
        api_hash=bot_data.api_hash,
        status="pending_verification"
    )
    
    # Add proxy settings if provided
    if bot_data.proxy_settings:
        bot.proxy_enabled = bot_data.proxy_settings.enabled
        bot.proxy_type = bot_data.proxy_settings.type
        bot.proxy_host = bot_data.proxy_settings.host
        bot.proxy_port = bot_data.proxy_settings.port
        bot.proxy_username = bot_data.proxy_settings.username
        bot.proxy_password = bot_data.proxy_settings.password
    
    # Add promotion settings if provided
    if bot_data.promotion_settings:
        bot.promotion_settings = bot_data.promotion_settings.dict()
    
    db.add(bot)
    db.commit()
    db.refresh(bot)
    
    return bot

@router.post("/bots/{bot_id}/verify-code")
async def verify_code(
    bot_id: int,
    phone_code: str,
    phone_code_hash: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify phone code for bot authentication"""
    bot = db.query(Bot).filter(Bot.id == bot_id, Bot.user_id == current_user.id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    result = await telethon_service.verify_code(
        bot_id=bot.id,
        phone_number=bot.phone_number,
        api_id=bot.api_id,
        api_hash=bot.api_hash,
        phone_code=phone_code,
        phone_code_hash=phone_code_hash,
        proxy_config={
            'enabled': bot.proxy_enabled,
            'type': bot.proxy_type,
            'host': bot.proxy_host,
            'port': bot.proxy_port,
            'username': bot.proxy_username,
            'password': bot.proxy_password
        } if bot.proxy_enabled else None
    )
    
    if result["status"] == "authenticated":
        bot.session_string = result["session_string"]
        bot.status = "offline"
        db.commit()
        return {"status": "success", "message": "Bot verified successfully"}
    
    return result

@router.post("/bots/{bot_id}/verify-password")
async def verify_password(
    bot_id: int,
    password: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify 2FA password for bot authentication"""
    bot = db.query(Bot).filter(Bot.id == bot_id, Bot.user_id == current_user.id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    result = await telethon_service.verify_password(
        bot_id=bot.id,
        api_id=bot.api_id,
        api_hash=bot.api_hash,
        password=password,
        proxy_config={
            'enabled': bot.proxy_enabled,
            'type': bot.proxy_type,
            'host': bot.proxy_host,
            'port': bot.proxy_port,
            'username': bot.proxy_username,
            'password': bot.proxy_password
        } if bot.proxy_enabled else None
    )
    
    if result["status"] == "authenticated":
        bot.session_string = result["session_string"]
        bot.status = "offline"
        db.commit()
        return {"status": "success", "message": "Bot verified successfully"}
    
    return result

@router.post("/bots/{bot_id}/start")
async def start_bot(
    bot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a userbot"""
    bot = db.query(Bot).filter(Bot.id == bot_id, Bot.user_id == current_user.id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    if not bot.session_string:
        raise HTTPException(status_code=400, detail="Bot not authenticated")
    
    success = await telethon_service.start_bot(bot)
    if success:
        bot.status = "online"
        db.commit()
        return {"status": "success", "message": "Bot started successfully"}
    
    raise HTTPException(status_code=500, detail="Failed to start bot")

@router.post("/bots/{bot_id}/stop")
async def stop_bot(
    bot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Stop a userbot"""
    bot = db.query(Bot).filter(Bot.id == bot_id, Bot.user_id == current_user.id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    success = await telethon_service.stop_bot(bot.id)
    if success:
        bot.status = "offline"
        db.commit()
        return {"status": "success", "message": "Bot stopped successfully"}
    
    raise HTTPException(status_code=500, detail="Failed to stop bot")

@router.get("/bots", response_model=BotList)
async def list_bots(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all userbots for current user"""
    bots = db.query(Bot).filter(Bot.user_id == current_user.id).all()
    return {
        "total": len(bots),
        "items": bots
    }

@router.get("/bots/{bot_id}", response_model=BotResponse)
async def get_bot(
    bot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get userbot details"""
    bot = db.query(Bot).filter(Bot.id == bot_id, Bot.user_id == current_user.id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return bot

@router.put("/bots/{bot_id}", response_model=BotResponse)
async def update_bot(
    bot_id: int,
    bot_data: BotUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update userbot settings"""
    bot = db.query(Bot).filter(Bot.id == bot_id, Bot.user_id == current_user.id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    # Update basic info
    if bot_data.name is not None:
        bot.name = bot_data.name
    
    # Update proxy settings
    if bot_data.proxy_settings:
        bot.proxy_enabled = bot_data.proxy_settings.enabled
        bot.proxy_type = bot_data.proxy_settings.type
        bot.proxy_host = bot_data.proxy_settings.host
        bot.proxy_port = bot_data.proxy_settings.port
        bot.proxy_username = bot_data.proxy_settings.username
        bot.proxy_password = bot_data.proxy_settings.password
    
    # Update promotion settings
    if bot_data.promotion_settings:
        bot.promotion_settings = bot_data.promotion_settings.dict()
    
    db.commit()
    db.refresh(bot)
    
    # Restart bot if it's running to apply new settings
    if bot.status == "online":
        await telethon_service.stop_bot(bot.id)
        await telethon_service.start_bot(bot)
    
    return bot

@router.delete("/bots/{bot_id}")
async def delete_bot(
    bot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a userbot"""
    bot = db.query(Bot).filter(Bot.id == bot_id, Bot.user_id == current_user.id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    # Stop bot if running
    if bot.status == "online":
        await telethon_service.stop_bot(bot.id)
    
    db.delete(bot)
    db.commit()
    
    return {"status": "success", "message": "Bot deleted successfully"}

@router.post("/bots/{bot_id}/test-message")
async def send_test_message(
    bot_id: int,
    target: str,
    message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a test message from the bot"""
    bot = db.query(Bot).filter(Bot.id == bot_id, Bot.user_id == current_user.id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    if bot.status != "online":
        raise HTTPException(status_code=400, detail="Bot is not running")
    
    success = await telethon_service.send_test_message(bot.id, target, message)
    if success:
        return {"status": "success", "message": "Test message sent successfully"}
    
    raise HTTPException(status_code=500, detail="Failed to send test message")
