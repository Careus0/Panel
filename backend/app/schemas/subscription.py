from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
from .base import BaseSchema, TimestampMixin, IDMixin

class PricingPlanBase(BaseModel):
    name: str = Field(..., description="Plan name")
    price: float = Field(..., ge=0, description="Plan price")
    currency: str = Field(default="USD", description="Currency code")
    billing_cycle: str = Field(default="monthly", description="Billing cycle")
    max_bots: int = Field(default=1, ge=1, description="Maximum bots allowed")
    features: List[str] = Field(default=[], description="Plan features")
    highlight: bool = Field(default=False, description="Highlight this plan")
    cta_text: str = Field(default="Get Started", description="Call to action text")

class PricingPlanCreate(PricingPlanBase):
    pass

class PricingPlanUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    billing_cycle: Optional[str] = None
    max_bots: Optional[int] = Field(None, ge=1)
    features: Optional[List[str]] = None
    highlight: Optional[bool] = None
    cta_text: Optional[str] = None
    is_active: Optional[bool] = None

class PricingPlanResponse(BaseSchema, IDMixin, PricingPlanBase, TimestampMixin):
    is_active: bool

class SubscriptionBase(BaseModel):
    plan_id: int = Field(..., description="Pricing plan ID")
    status: str = Field(default="active", description="Subscription status")
    auto_renew: bool = Field(default=True, description="Auto renewal setting")
    payment_method: Optional[str] = Field(None, description="Payment method")

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    status: Optional[str] = None
    auto_renew: Optional[bool] = None
    payment_method: Optional[str] = None
    expires_at: Optional[datetime] = None

class SubscriptionResponse(BaseSchema, IDMixin, SubscriptionBase, TimestampMixin):
    user_id: int
    started_at: datetime
    expires_at: Optional[datetime] = None
    plan: PricingPlanResponse

class PaymentBase(BaseModel):
    amount: float = Field(..., ge=0, description="Payment amount")
    currency: str = Field(default="USD", description="Currency code")
    payment_method: str = Field(..., description="Payment method")
    transaction_id: str = Field(..., description="Transaction ID")
    metadata: Optional[dict] = Field(default={}, description="Additional metadata")

class PaymentCreate(PaymentBase):
    subscription_id: int

class PaymentUpdate(BaseModel):
    status: Optional[str] = None
    metadata: Optional[dict] = None

class PaymentResponse(BaseSchema, IDMixin, PaymentBase, TimestampMixin):
    subscription_id: int
    status: str
    payment_date: datetime

class SubscribeRequest(BaseModel):
    plan_id: int = Field(..., description="Plan ID to subscribe to")
    payment_method: str = Field(..., description="Payment method")
    payment_data: Optional[dict] = Field(default={}, description="Payment processor data")

class SubscriptionWithPayments(SubscriptionResponse):
    payments: List[PaymentResponse] = []

class PricingPlansResponse(BaseModel):
    plans: List[PricingPlanResponse]
    total: int
