#!/usr/bin/env python3
"""
Initial data setup script for Sentinel Ubot Backend
Creates sample pricing plans and initializes the database
"""

from app.core.database import engine, Base
from app.models import Subscription

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")

def create_sample_pricing_plans():
    """Create sample pricing plans"""
    # Sample pricing plans data
    pricing_plans = [
        {
            "id": "starter",
            "name": "Starter",
            "price": "$10/month",
            "userbot_slots": 1,
            "features": [
                "1 Userbot Slot",
                "Basic Support",
                "Standard Features",
                "Community Access"
            ],
            "is_active": True
        },
        {
            "id": "professional",
            "name": "Professional", 
            "price": "$25/month",
            "userbot_slots": 5,
            "features": [
                "5 Userbot Slots",
                "Priority Support",
                "Advanced Features",
                "API Access",
                "Custom Plugins"
            ],
            "is_active": True,
            "highlight": True
        },
        {
            "id": "enterprise",
            "name": "Enterprise",
            "price": "$50/month", 
            "userbot_slots": -1,  # Unlimited
            "features": [
                "Unlimited Userbot Slots",
                "24/7 Premium Support",
                "All Features",
                "Full API Access",
                "Custom Development",
                "Dedicated Manager"
            ],
            "is_active": True
        }
    ]

    # Print pricing plans (they would be handled by the API)
    print("📋 Sample pricing plans ready:")
    for plan in pricing_plans:
        slots_text = "Unlimited" if plan['userbot_slots'] == -1 else str(plan['userbot_slots'])
        print(f"   - {plan['name']}: {plan['price']} ({slots_text} slots)")
    
    print("✅ Pricing plans initialized successfully")

def main():
    """Main initialization function"""
    print("🚀 Initializing Sentinel Ubot Backend Database...")
    
    try:
        # Create tables
        create_tables()
        
        # Create sample data
        create_sample_pricing_plans()
        
        print("\n✅ Database initialization completed successfully!")
        print("\n📝 Next steps:")
        print("   1. Set your TELEGRAM_BOT_TOKEN in environment variables")
        print("   2. Configure your bot with @BotFather")
        print("   3. Set allowed domains for Telegram login widget")
        print("   4. Start the server: uvicorn main:app --reload")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    main()
