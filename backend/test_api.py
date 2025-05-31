import requests
import json
import time
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings
from app.models.user import User
from app.core.database import SessionLocal
from sqlalchemy.orm import Session

BASE_URL = f"http://localhost:8000{settings.API_V1_STR}"

# Mock token for testing without real authentication
MOCK_TOKEN = "mocked_token_for_testing"

def get_headers(token: str):
    """Get headers with authentication token"""
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

def handle_response(response, operation: str):
    """Handle API response with proper error reporting"""
    print(f"\n{operation} Response Status: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
        return data if response.ok else None
    except Exception as e:
        print(f"Error parsing response: {str(e)}")
        return None

def test_list_bots():
    """Test listing all bots"""
    print("\nTesting List Bots...")
    url = f"{BASE_URL}/bots/bots"
    response = requests.get(url, headers=get_headers(MOCK_TOKEN))
    return handle_response(response, "List Bots")

def test_get_bot(bot_id: int):
    """Test getting bot details"""
    print("\nTesting Get Bot...")
    url = f"{BASE_URL}/bots/bots/{bot_id}"
    response = requests.get(url, headers=get_headers(MOCK_TOKEN))
    return handle_response(response, "Get Bot")

def test_update_bot(bot_id: int):
    """Test updating bot settings"""
    print("\nTesting Update Bot...")
    url = f"{BASE_URL}/bots/bots/{bot_id}"
    data = {
        "name": "Updated Test Bot",
        "proxy_settings": {
            "enabled": False
        },
        "promotion_settings": {
            "enabled": True,
            "message_template": "Updated promotion message",
            "target_groups": ["@test_group", "@another_group"],
            "interval": 7200
        }
    }
    response = requests.put(url, json=data, headers=get_headers(MOCK_TOKEN))
    return handle_response(response, "Update Bot")

def test_delete_bot(bot_id: int):
    """Test deleting a bot"""
    print("\nTesting Delete Bot...")
    url = f"{BASE_URL}/bots/bots/{bot_id}"
    response = requests.delete(url, headers=get_headers(MOCK_TOKEN))
    return handle_response(response, "Delete Bot")

if __name__ == "__main__":
    print("Starting API Tests...")
    
    # Test listing bots (should be empty initially)
    result = test_list_bots()
    if result:
        print("\nInitial bot list:", result)
    
    # Test getting non-existent bot (should return 404)
    result = test_get_bot(999)
    if result:
        print("\nGet non-existent bot:", result)
    
    # Test updating non-existent bot (should return 404)
    result = test_update_bot(999)
    if result:
        print("\nUpdate non-existent bot:", result)
    
    # Test deleting non-existent bot (should return 404)
    result = test_delete_bot(999)
    if result:
        print("\nDelete non-existent bot:", result)
