from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.core.database import engine, Base
from app.middleware import setup_middleware
from app.api import api_router

# Create database tables
def create_tables():
    """Create database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

# Create FastAPI application for Vercel
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Secure backend for Sentinel Ubot with Telegram authentication",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Setup CORS for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://*.vercel.app",
        "https://careus-001-site1.mtempurl.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup other middleware
setup_middleware(app, settings)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Initialize database on startup
create_tables()

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Sentinel Ubot Backend",
        "version": "1.0.0",
        "environment": "vercel"
    }

# Root endpoint
@app.get("/api")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Sentinel Ubot Backend API",
        "docs": "/api/docs",
        "health": "/api/health",
        "version": "1.0.0"
    }

# Export the app for Vercel
handler = app
