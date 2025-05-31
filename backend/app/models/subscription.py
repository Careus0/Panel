from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class PricingPlan(Base):
    __tablename__ = "pricing_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Basic", "Pro", "Enterprise"
    price = Column(Float, nullable=False)  # Price in USD
    currency = Column(String, default="USD")
    billing_cycle = Column(String, default="monthly")  # monthly, yearly
    max_bots = Column(Integer, default=1)  # Maximum number of bots allowed
    features = Column(JSON)  # List of features as JSON array
    is_active = Column(Boolean, default=True)
    highlight = Column(Boolean, default=False)  # For highlighting popular plans
    cta_text = Column(String, default="Get Started")  # Call to action text
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    subscriptions = relationship("Subscription", back_populates="plan")

    def __repr__(self):
        return f"<PricingPlan {self.name}>"

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("pricing_plans.id"), nullable=False)
    status = Column(String, default="active")  # active, cancelled, expired, pending
    started_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    auto_renew = Column(Boolean, default=True)
    payment_method = Column(String)  # e.g., "stripe", "paypal", "crypto"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="subscription")
    plan = relationship("PricingPlan", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription")

    def __repr__(self):
        return f"<Subscription {self.user_id} - {self.plan.name}>"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    status = Column(String, default="pending")  # pending, completed, failed, refunded
    payment_date = Column(DateTime, default=datetime.utcnow)
    transaction_id = Column(String, unique=True)  # External payment processor transaction ID
    payment_method = Column(String)  # stripe, paypal, crypto, etc.
    payment_metadata = Column(JSON)  # Additional payment metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    subscription = relationship("Subscription", back_populates="payments")

    def __repr__(self):
        return f"<Payment {self.transaction_id}>"
