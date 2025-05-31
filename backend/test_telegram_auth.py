import requests
import json
import hashlib
import hmac
import time
from app.core.config import settings

BASE_URL = f"http://localhost:8000{settings.API_V1_STR}"

def create_telegram_auth_data(user_data: dict, bot_token: str) -> dict:
    """
    Create valid Telegram authentication data with proper hash
    """
    # Create data check string
    data_check_arr = []
    for key, value in sorted(user_data.items()):
        if key != 'hash':
            data_check_arr.append(f"{key}={value}")
    data_check_string = '\n'.join(data_check_arr)
    
    # Create secret key from bot token
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    
    # Calculate HMAC-SHA256
    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Add hash to user data
    auth_data = user_data.copy()
    auth_data['hash'] = calculated_hash
    
    return auth_data

def test_telegram_login():
    """Test Telegram login with valid authentication data"""
    print("🚀 Testing Telegram Login Integration...")
    
    # Mock user data (this would come from Telegram widget)
    current_timestamp = int(time.time())
    user_data = {
        "id": "123456789",
        "first_name": "Test",
        "last_name": "User",
        "username": "testuser",
        "photo_url": "https://t.me/i/userpic/320/testuser.jpg",
        "auth_date": str(current_timestamp)
    }
    
    # Create valid auth data with proper hash
    if settings.TELEGRAM_BOT_TOKEN:
        auth_data = create_telegram_auth_data(user_data, settings.TELEGRAM_BOT_TOKEN)
        
        print("\n📝 Auth Data:")
        print(json.dumps(auth_data, indent=2))
        
        # Test login
        print("\n🔐 Testing Login...")
        response = requests.post(f"{BASE_URL}/auth/telegram", json={
            "auth_data": auth_data
        })
        
        print(f"Status: {response.status_code}")
        try:
            data = response.json()
            print(json.dumps(data, indent=2))
            
            if response.ok:
                print("\n✅ Login successful!")
                token = data["token"]["access_token"]
                
                # Test authenticated endpoint
                print("\n🔍 Testing authenticated endpoint...")
                headers = {"Authorization": f"Bearer {token}"}
                me_response = requests.get(f"{BASE_URL}/users/me", headers=headers)
                
                print(f"User profile status: {me_response.status_code}")
                if me_response.ok:
                    user_data = me_response.json()
                    print(json.dumps(user_data, indent=2))
                    print("\n✅ Authentication flow working correctly!")
                else:
                    print("❌ Failed to get user profile")
            else:
                print("❌ Login failed")
                
        except Exception as e:
            print(f"❌ Error parsing response: {e}")
            print(f"Raw response: {response.text}")
    else:
        print("❌ TELEGRAM_BOT_TOKEN not configured")
        print("Please set TELEGRAM_BOT_TOKEN in your environment variables")

if __name__ == "__main__":
    test_telegram_login()
