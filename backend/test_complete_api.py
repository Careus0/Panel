import requests
import json
from app.core.config import settings

BASE_URL = f"http://localhost:8000{settings.API_V1_STR}"
MOCK_TOKEN = "mocked_token_for_testing"

def get_headers():
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {MOCK_TOKEN}"
    }

def handle_response(response, operation: str):
    print(f"\n{operation} Response Status: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
        return data if response.ok else None
    except Exception as e:
        print(f"Error parsing response: {str(e)}")
        return None

def test_auth_endpoints():
    """Test authentication endpoints"""
    print("\n=== Testing Authentication Endpoints ===")
    
    # Test Telegram login endpoint
    print("\nTesting Telegram Login...")
    url = f"{BASE_URL}/auth/telegram"
    # This will fail without proper Telegram auth data, but we can test the endpoint exists
    response = requests.post(url, json={
        "auth_data": {
            "id": "123456789",
            "first_name": "Test",
            "username": "testuser",
            "auth_date": "1234567890",
            "hash": "invalid_hash"
        }
    })
    handle_response(response, "Telegram Login")

def test_user_endpoints():
    """Test user endpoints"""
    print("\n=== Testing User Endpoints ===")
    
    # Test get user profile
    print("\nTesting Get User Profile...")
    url = f"{BASE_URL}/users/me"
    response = requests.get(url, headers=get_headers())
    handle_response(response, "Get User Profile")

def test_bot_endpoints():
    """Test bot endpoints"""
    print("\n=== Testing Bot Endpoints ===")
    
    # Test list bots (initial state)
    print("\nTesting Initial List Bots...")
    url = f"{BASE_URL}/bots/bots"
    response = requests.get(url, headers=get_headers())
    result = handle_response(response, "Initial List Bots")
    
    # Test create bot
    print("\nTesting Create Bot...")
    url = f"{BASE_URL}/bots/bots"
    bot_data = {
        "name": "Test Bot",
        "phone_number": "+1234567890",
        "api_id": "12345",
        "api_hash": "abcdef1234567890",
        "proxy_settings": {
            "enabled": False
        },
        "promotion_settings": {
            "enabled": False,
            "message_template": "",
            "target_groups": [],
            "interval": 3600
        }
    }
    response = requests.post(url, json=bot_data, headers=get_headers())
    create_result = handle_response(response, "Create Bot")
    
    if create_result and "id" in create_result:
        bot_id = create_result["id"]
        
        # Test get bot
        print(f"\nTesting Get Bot {bot_id}...")
        url = f"{BASE_URL}/bots/bots/{bot_id}"
        response = requests.get(url, headers=get_headers())
        handle_response(response, "Get Bot")
        
        # Test update bot
        print(f"\nTesting Update Bot {bot_id}...")
        url = f"{BASE_URL}/bots/bots/{bot_id}"
        update_data = {
            "name": "Updated Test Bot",
            "proxy_settings": {
                "enabled": True,
                "type": "socks5",
                "host": "proxy.example.com",
                "port": 1080
            }
        }
        response = requests.put(url, json=update_data, headers=get_headers())
        handle_response(response, "Update Bot")
        
        # Test delete bot
        print(f"\nTesting Delete Bot {bot_id}...")
        url = f"{BASE_URL}/bots/bots/{bot_id}"
        response = requests.delete(url, headers=get_headers())
        handle_response(response, "Delete Bot")
    
    # Test get non-existent bot
    print("\nTesting Get Non-existent Bot...")
    url = f"{BASE_URL}/bots/bots/999"
    response = requests.get(url, headers=get_headers())
    handle_response(response, "Get Non-existent Bot")

def test_subscription_endpoints():
    """Test subscription endpoints"""
    print("\n=== Testing Subscription Endpoints ===")
    
    # Test get subscription plans
    print("\nTesting Get Subscription Plans...")
    url = f"{BASE_URL}/subscriptions/plans"
    response = requests.get(url, headers=get_headers())
    handle_response(response, "Get Subscription Plans")
    
    # Test get current subscription
    print("\nTesting Get Current Subscription...")
    url = f"{BASE_URL}/subscriptions/current"
    response = requests.get(url, headers=get_headers())
    handle_response(response, "Get Current Subscription")

def test_health_endpoint():
    """Test health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    
    print("\nTesting Health Check...")
    url = "http://localhost:8000/health"
    response = requests.get(url)
    handle_response(response, "Health Check")

if __name__ == "__main__":
    print("🚀 Starting Comprehensive API Tests...")
    
    # Test all endpoints
    test_health_endpoint()
    test_auth_endpoints()
    test_user_endpoints()
    test_bot_endpoints()
    test_subscription_endpoints()
    
    print("\n✅ API Tests Completed!")
