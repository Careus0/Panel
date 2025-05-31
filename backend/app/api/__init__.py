from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .bots import router as bots_router
from .subscriptions import router as subscriptions_router

# Create main API router
api_router = APIRouter()

# Include all routers with their prefixes
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(bots_router, prefix="/bots", tags=["Bots"])
api_router.include_router(subscriptions_router, prefix="/subscriptions", tags=["Subscriptions"])

__all__ = ["api_router"]
