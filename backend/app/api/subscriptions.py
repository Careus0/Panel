from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from ..core.database import get_db
from ..middleware.auth import get_current_active_user
from ..middleware.rate_limiter import api_rate_limiter
from ..schemas.subscription import (
    PricingPlanResponse,
    SubscriptionResponse,
    SubscribeRequest,
    PricingPlansResponse,
    SubscriptionWithPayments,
    PaymentCreate,
    PaymentResponse
)
from ..models.user import User
from ..models.subscription import PricingPlan, Subscription, Payment

router = APIRouter()

@router.get("/plans", response_model=PricingPlansResponse, dependencies=[Depends(api_rate_limiter)])
async def get_pricing_plans(
    db: Session = Depends(get_db)
) -> PricingPlansResponse:
    """
    Get all active pricing plans
    """
    plans = db.query(PricingPlan).filter(PricingPlan.is_active == True).all()
    return PricingPlansResponse(
        plans=[PricingPlanResponse.model_validate(plan) for plan in plans],
        total=len(plans)
    )

@router.get("/current", response_model=SubscriptionWithPayments, dependencies=[Depends(api_rate_limiter)])
async def get_current_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> SubscriptionWithPayments:
    """
    Get current user's subscription with payment history
    """
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    # Get payment history
    payments = db.query(Payment).filter(
        Payment.subscription_id == subscription.id
    ).order_by(Payment.created_at.desc()).all()
    
    return SubscriptionWithPayments(
        **subscription.__dict__,
        payments=[PaymentResponse.model_validate(payment) for payment in payments]
    )

@router.post("/subscribe", response_model=SubscriptionResponse, dependencies=[Depends(api_rate_limiter)])
async def subscribe_to_plan(
    subscribe_data: SubscribeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> SubscriptionResponse:
    """
    Subscribe to a pricing plan
    """
    # Check if plan exists
    plan = db.query(PricingPlan).filter(
        PricingPlan.id == subscribe_data.plan_id,
        PricingPlan.is_active == True
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found or inactive"
        )
    
    # Cancel current subscription if exists
    current_subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).first()
    if current_subscription:
        current_subscription.status = "cancelled"
        current_subscription.auto_renew = False
    
    # Create new subscription
    subscription = Subscription(
        user_id=current_user.id,
        plan_id=plan.id,
        status="pending",
        payment_method=subscribe_data.payment_method,
        started_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=30)  # Default to 30 days
    )
    
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    
    # Create payment record
    payment = Payment(
        subscription_id=subscription.id,
        amount=plan.price,
        currency=plan.currency,
        payment_method=subscribe_data.payment_method,
        transaction_id=f"PAYMENT_{datetime.utcnow().timestamp()}",  # Replace with actual payment processing
        metadata=subscribe_data.payment_data
    )
    
    db.add(payment)
    
    # Update subscription status after payment
    subscription.status = "active"
    
    db.commit()
    db.refresh(subscription)
    
    return SubscriptionResponse.model_validate(subscription)

@router.post("/cancel", dependencies=[Depends(api_rate_limiter)])
async def cancel_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Cancel current subscription
    """
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )
    
    subscription.status = "cancelled"
    subscription.auto_renew = False
    db.commit()
    
    return {"message": "Subscription successfully cancelled"}

@router.get("/payments", response_model=List[PaymentResponse], dependencies=[Depends(api_rate_limiter)])
async def get_payment_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> List[PaymentResponse]:
    """
    Get payment history for current user
    """
    payments = db.query(Payment).join(Subscription).filter(
        Subscription.user_id == current_user.id
    ).order_by(Payment.created_at.desc()).all()
    
    return [PaymentResponse.model_validate(payment) for payment in payments]

@router.post("/payments/verify", dependencies=[Depends(api_rate_limiter)])
async def verify_payment(
    payment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Verify a payment status
    """
    payment = db.query(Payment).join(Subscription).filter(
        Payment.id == payment_id,
        Subscription.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Add payment verification logic here
    # This should integrate with your payment processor
    
    return {"status": payment.status}
