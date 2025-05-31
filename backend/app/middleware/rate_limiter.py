from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from typing import Dict, Optional
import time
from collections import defaultdict, deque
from ..core.config import settings

class RateLimiter:
    def __init__(self, max_requests: int = None, window_seconds: int = 60):
        self.max_requests = max_requests or settings.RATE_LIMIT_PER_MINUTE
        self.window_seconds = window_seconds
        self.requests: Dict[str, deque] = defaultdict(deque)
    
    def is_allowed(self, identifier: str) -> bool:
        """
        Check if request is allowed based on rate limiting
        """
        now = time.time()
        window_start = now - self.window_seconds
        
        # Clean old requests outside the window
        while self.requests[identifier] and self.requests[identifier][0] < window_start:
            self.requests[identifier].popleft()
        
        # Check if under limit
        if len(self.requests[identifier]) < self.max_requests:
            self.requests[identifier].append(now)
            return True
        
        return False
    
    def get_reset_time(self, identifier: str) -> Optional[float]:
        """
        Get the time when the rate limit will reset for this identifier
        """
        if not self.requests[identifier]:
            return None
        
        return self.requests[identifier][0] + self.window_seconds

# Global rate limiter instance
rate_limiter = RateLimiter()

async def rate_limit_middleware(request: Request, call_next):
    """
    Rate limiting middleware
    """
    # Get client identifier (IP address)
    client_ip = request.client.host
    
    # Check if request is allowed
    if not rate_limiter.is_allowed(client_ip):
        reset_time = rate_limiter.get_reset_time(client_ip)
        retry_after = int(reset_time - time.time()) if reset_time else 60
        
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "detail": "Rate limit exceeded",
                "retry_after": retry_after
            },
            headers={"Retry-After": str(retry_after)}
        )
    
    response = await call_next(request)
    return response

def create_rate_limiter(max_requests: int, window_seconds: int = 60):
    """
    Create a custom rate limiter for specific endpoints
    """
    limiter = RateLimiter(max_requests, window_seconds)
    
    async def rate_limit_dependency(request: Request):
        client_ip = request.client.host
        
        if not limiter.is_allowed(client_ip):
            reset_time = limiter.get_reset_time(client_ip)
            retry_after = int(reset_time - time.time()) if reset_time else window_seconds
            
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={"Retry-After": str(retry_after)}
            )
    
    return rate_limit_dependency

# Specific rate limiters for different endpoints
auth_rate_limiter = create_rate_limiter(max_requests=5, window_seconds=300)  # 5 requests per 5 minutes
api_rate_limiter = create_rate_limiter(max_requests=100, window_seconds=60)  # 100 requests per minute
