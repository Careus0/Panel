import asyncio
import logging
from typing import Dict, Optional, List
from telethon import TelegramClient, events
from telethon.sessions import StringSession
from telethon.errors import SessionPasswordNeededError, PhoneCodeInvalidError
from telethon.tl.types import PeerChannel, PeerChat, PeerUser
import python_socks
from sqlalchemy.orm import Session
from ..models.bot import Bot
from ..core.database import get_db

logger = logging.getLogger(__name__)

class TelethonService:
    def __init__(self):
        self.active_clients: Dict[int, TelegramClient] = {}
        self.promotion_tasks: Dict[int, asyncio.Task] = {}
    
    async def create_client(self, bot_id: int, api_id: str, api_hash: str, 
                          session_string: str = None, proxy_config: dict = None) -> TelegramClient:
        """Create a new Telethon client with optional proxy support"""
        
        # Configure proxy if provided
        proxy = None
        if proxy_config and proxy_config.get('enabled'):
            proxy_type = proxy_config.get('type', 'socks5')
            proxy_host = proxy_config.get('host')
            proxy_port = proxy_config.get('port')
            proxy_username = proxy_config.get('username')
            proxy_password = proxy_config.get('password')
            
            if proxy_type == 'socks5':
                proxy = (python_socks.ProxyType.SOCKS5, proxy_host, proxy_port, 
                        True, proxy_username, proxy_password)
            elif proxy_type == 'socks4':
                proxy = (python_socks.ProxyType.SOCKS4, proxy_host, proxy_port)
            elif proxy_type == 'http':
                proxy = (python_socks.ProxyType.HTTP, proxy_host, proxy_port,
                        True, proxy_username, proxy_password)
        
        # Create session
        session = StringSession(session_string) if session_string else StringSession()
        
        # Create client with connection parameters
        client = TelegramClient(
            session,
            api_id,
            api_hash,
            proxy=proxy,
            connection_retries=3,
            retry_delay=1,
            timeout=30
        )
        
        return client
    
    async def authenticate_bot(self, bot_id: int, phone_number: str, api_id: str, 
                             api_hash: str, proxy_config: dict = None) -> dict:
        """Start authentication process for a new bot"""
        try:
            client = await self.create_client(bot_id, api_id, api_hash, proxy_config=proxy_config)
            
            await client.connect()
            
            if not await client.is_user_authorized():
                # Send code request
                sent_code = await client.send_code_request(phone_number)
                
                return {
                    "status": "code_sent",
                    "phone_code_hash": sent_code.phone_code_hash,
                    "message": "Verification code sent to your phone"
                }
            else:
                # Already authorized
                session_string = client.session.save()
                await client.disconnect()
                
                return {
                    "status": "authenticated",
                    "session_string": session_string,
                    "message": "Bot authenticated successfully"
                }
                
        except Exception as e:
            logger.error(f"Authentication error for bot {bot_id}: {str(e)}")
            return {
                "status": "error",
                "message": f"Authentication failed: {str(e)}"
            }
    
    async def verify_code(self, bot_id: int, phone_number: str, api_id: str, 
                         api_hash: str, phone_code: str, phone_code_hash: str,
                         proxy_config: dict = None) -> dict:
        """Verify the phone code and complete authentication"""
        try:
            client = await self.create_client(bot_id, api_id, api_hash, proxy_config=proxy_config)
            await client.connect()
            
            try:
                await client.sign_in(phone_number, phone_code, phone_code_hash=phone_code_hash)
            except SessionPasswordNeededError:
                return {
                    "status": "password_required",
                    "message": "Two-factor authentication password required"
                }
            except PhoneCodeInvalidError:
                return {
                    "status": "invalid_code",
                    "message": "Invalid verification code"
                }
            
            # Get session string
            session_string = client.session.save()
            await client.disconnect()
            
            return {
                "status": "authenticated",
                "session_string": session_string,
                "message": "Bot authenticated successfully"
            }
            
        except Exception as e:
            logger.error(f"Code verification error for bot {bot_id}: {str(e)}")
            return {
                "status": "error",
                "message": f"Code verification failed: {str(e)}"
            }
    
    async def verify_password(self, bot_id: int, api_id: str, api_hash: str, 
                            password: str, proxy_config: dict = None) -> dict:
        """Verify 2FA password"""
        try:
            client = await self.create_client(bot_id, api_id, api_hash, proxy_config=proxy_config)
            await client.connect()
            
            await client.sign_in(password=password)
            
            # Get session string
            session_string = client.session.save()
            await client.disconnect()
            
            return {
                "status": "authenticated",
                "session_string": session_string,
                "message": "Bot authenticated successfully"
            }
            
        except Exception as e:
            logger.error(f"Password verification error for bot {bot_id}: {str(e)}")
            return {
                "status": "error",
                "message": f"Password verification failed: {str(e)}"
            }
    
    async def start_bot(self, bot: Bot) -> bool:
        """Start a userbot and begin monitoring"""
        try:
            if bot.id in self.active_clients:
                return True  # Already running
            
            # Create proxy config
            proxy_config = None
            if bot.proxy_enabled:
                proxy_config = {
                    'enabled': True,
                    'type': bot.proxy_type,
                    'host': bot.proxy_host,
                    'port': bot.proxy_port,
                    'username': bot.proxy_username,
                    'password': bot.proxy_password
                }
            
            # Create and start client
            client = await self.create_client(
                bot.id, bot.api_id, bot.api_hash, 
                bot.session_string, proxy_config
            )
            
            await client.connect()
            
            if not await client.is_user_authorized():
                logger.error(f"Bot {bot.id} is not authorized")
                return False
            
            # Store active client
            self.active_clients[bot.id] = client
            
            # Start promotion task if enabled
            if bot.promotion_settings and bot.promotion_settings.get('enabled'):
                await self.start_promotion_task(bot)
            
            logger.info(f"Bot {bot.id} started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start bot {bot.id}: {str(e)}")
            return False
    
    async def stop_bot(self, bot_id: int) -> bool:
        """Stop a userbot"""
        try:
            # Stop promotion task
            if bot_id in self.promotion_tasks:
                self.promotion_tasks[bot_id].cancel()
                del self.promotion_tasks[bot_id]
            
            # Disconnect client
            if bot_id in self.active_clients:
                await self.active_clients[bot_id].disconnect()
                del self.active_clients[bot_id]
            
            logger.info(f"Bot {bot_id} stopped successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to stop bot {bot_id}: {str(e)}")
            return False
    
    async def start_promotion_task(self, bot: Bot):
        """Start automated promotion task for a bot"""
        async def promotion_loop():
            client = self.active_clients.get(bot.id)
            if not client:
                return
            
            settings = bot.promotion_settings
            message_template = settings.get('message_template', '')
            target_groups = settings.get('target_groups', [])
            interval = settings.get('interval', 3600)
            
            while True:
                try:
                    for group in target_groups:
                        try:
                            # Send message to group
                            await client.send_message(group, message_template)
                            logger.info(f"Promotion message sent to {group} by bot {bot.id}")
                            
                            # Wait between messages to avoid spam
                            await asyncio.sleep(5)
                            
                        except Exception as e:
                            logger.error(f"Failed to send promotion to {group}: {str(e)}")
                    
                    # Wait for next cycle
                    await asyncio.sleep(interval)
                    
                except asyncio.CancelledError:
                    break
                except Exception as e:
                    logger.error(f"Promotion task error for bot {bot.id}: {str(e)}")
                    await asyncio.sleep(60)  # Wait before retrying
        
        # Create and store task
        task = asyncio.create_task(promotion_loop())
        self.promotion_tasks[bot.id] = task
    
    async def get_bot_info(self, bot_id: int) -> dict:
        """Get information about a running bot"""
        client = self.active_clients.get(bot_id)
        if not client:
            return {"status": "offline", "info": None}
        
        try:
            me = await client.get_me()
            return {
                "status": "online",
                "info": {
                    "id": me.id,
                    "username": me.username,
                    "first_name": me.first_name,
                    "last_name": me.last_name,
                    "phone": me.phone
                }
            }
        except Exception as e:
            logger.error(f"Failed to get bot info for {bot_id}: {str(e)}")
            return {"status": "error", "info": None}
    
    async def send_test_message(self, bot_id: int, target: str, message: str) -> bool:
        """Send a test message to verify bot functionality"""
        client = self.active_clients.get(bot_id)
        if not client:
            return False
        
        try:
            await client.send_message(target, message)
            return True
        except Exception as e:
            logger.error(f"Failed to send test message from bot {bot_id}: {str(e)}")
            return False

# Global service instance
telethon_service = TelethonService()
