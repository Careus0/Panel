from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
import time

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add security headers to all responses
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Remove server header for security
        if "server" in response.headers:
            del response.headers["server"]
        
        return response

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Log all requests for security monitoring
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request details
        client_ip = request.client.host
        method = request.method
        url = str(request.url)
        user_agent = request.headers.get("user-agent", "")
        
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response details
        status_code = response.status_code
        
        # You can integrate with your logging system here
        print(f"{client_ip} - {method} {url} - {status_code} - {process_time:.3f}s - {user_agent}")
        
        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)
        
        return response

def setup_cors_middleware(app, settings):
    """
    Setup CORS middleware with secure defaults
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Process-Time"]
    )

def setup_trusted_host_middleware(app, allowed_hosts=None):
    """
    Setup trusted host middleware
    """
    if allowed_hosts is None:
        allowed_hosts = ["localhost", "127.0.0.1", "*.localhost"]
    
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=allowed_hosts
    )

class IPWhitelistMiddleware(BaseHTTPMiddleware):
    """
    IP whitelist middleware for admin endpoints
    """
    def __init__(self, app, whitelist: list = None):
        super().__init__(app)
        self.whitelist = whitelist or ["127.0.0.1", "::1"]  # localhost by default
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        
        # Check if accessing admin endpoints
        if request.url.path.startswith("/admin"):
            if client_ip not in self.whitelist:
                return Response(
                    content="Access denied",
                    status_code=403
                )
        
        response = await call_next(request)
        return response
