from fastapi import FastAPI
from .auth import get_current_user, get_current_active_user, get_optional_current_user
from .rate_limiter import rate_limit_middleware, auth_rate_limiter, api_rate_limiter
from .security import (
    SecurityHeadersMiddleware,
    RequestLoggingMiddleware,
    setup_cors_middleware,
    setup_trusted_host_middleware,
    IPWhitelistMiddleware
)

def setup_middleware(app: FastAPI, settings) -> None:
    """
    Setup all middleware for the application
    """
    # Security headers middleware
    app.add_middleware(SecurityHeadersMiddleware)
    
    # Request logging middleware
    app.add_middleware(RequestLoggingMiddleware)
    
    # Rate limiting middleware
    app.middleware("http")(rate_limit_middleware)
    
    # CORS middleware
    setup_cors_middleware(app, settings)
    
    # Trusted host middleware
    setup_trusted_host_middleware(app)
    
    # IP whitelist middleware for admin endpoints
    app.add_middleware(
        IPWhitelistMiddleware,
        whitelist=["127.0.0.1", "::1"]  # Add your admin IPs here
    )

__all__ = [
    "setup_middleware",
    "get_current_user",
    "get_current_active_user",
    "get_optional_current_user",
    "auth_rate_limiter",
    "api_rate_limiter",
]
