from fastapi import FastAPI
from app.api import api_router
from app.core.config import settings

app = FastAPI()
app.include_router(api_router, prefix=settings.API_V1_STR)

print("\nRegistered routes:")
for route in app.routes:
    print(f"{route.methods} {route.path}")
