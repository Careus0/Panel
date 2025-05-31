# Deployment Guide for Pterodactyl

## Prerequisites
- Pterodactyl Panel installed and configured
- Docker installed on the server
- Domain configured: `careus-001-site1.mtempurl.com`

## Environment Setup

### Backend (.env)
```env
# Database Configuration
DATABASE_URL=sqlite:///./sentinel.db

# Security Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-bot-token-here
TELEGRAM_BOT_USERNAME=Mr_Sakamotobot

# Server Configuration
HOST=0.0.0.0
PORT=8000
BACKEND_CORS_ORIGINS=["https://careus-001-site1.mtempurl.com"]

# Rate Limiting
RATE_LIMIT_PER_SECOND=10

# Session Configuration
SESSION_EXPIRE_DAYS=7
```

### Frontend (.env)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://careus-001-site1.mtempurl.com
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=Mr_Sakamotobot

# Application Configuration
NEXT_PUBLIC_APP_NAME=Sentinel Ubot
NEXT_PUBLIC_APP_URL=https://careus-001-site1.mtempurl.com

# Development Configuration
PORT=3000
```

## Pterodactyl Setup

### Backend Server

1. Create a new server in Pterodactyl:
   - Name: `sentinel-backend`
   - Docker Image: `python:3.11-slim`
   - Startup Command:
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port {{SERVER_PORT}}
   ```

2. Environment Variables:
   - Add all variables from backend `.env` file
   - Set `PORT` to match the allocated port in Pterodactyl

3. File Management:
   - Upload all backend files to the server
   - Ensure proper permissions on uploaded files

### Frontend Server

1. Create a new server in Pterodactyl:
   - Name: `sentinel-frontend`
   - Docker Image: `node:18-alpine`
   - Startup Command:
   ```bash
   yarn start
   ```

2. Environment Variables:
   - Add all variables from frontend `.env` file
   - Set `PORT` to match the allocated port in Pterodactyl
   - Set `NEXT_PUBLIC_API_URL` to point to the backend server URL

3. File Management:
   - Upload all frontend files to the server
   - Ensure proper permissions on uploaded files

## Deployment Steps

### Backend Deployment

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run database migrations:
```bash
alembic upgrade head
```

3. Start the server:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment

1. Install dependencies:
```bash
yarn install
```

2. Build the application:
```bash
yarn build
```

3. Start the server:
```bash
yarn start
```

## Domain Configuration

1. Configure DNS:
   - Point your domain to the Pterodactyl server IP
   - Set up SSL certificates using Let's Encrypt

2. Update Telegram Bot:
   - Use @BotFather to set the domain
   - Command: `/setdomain`
   - Domain: `careus-001-site1.mtempurl.com`

## Security Considerations

1. Environment Variables:
   - Keep all sensitive information in `.env` files
   - Never commit `.env` files to version control
   - Use different values for production and development

2. SSL/TLS:
   - Enable HTTPS for all connections
   - Configure SSL certificates properly
   - Redirect HTTP to HTTPS

3. CORS Configuration:
   - Backend: Configured to accept requests only from frontend domain
   - Frontend: Set to communicate only with backend domain

4. Rate Limiting:
   - Configured in backend to prevent abuse
   - Monitor and adjust limits as needed

## Monitoring

1. Log Files:
   - Backend logs: Check application logs in Pterodactyl panel
   - Frontend logs: Available in the panel's console

2. Performance:
   - Monitor server resources through Pterodactyl
   - Set up alerts for high resource usage

3. Error Tracking:
   - Check application logs for errors
   - Monitor API response times

## Troubleshooting

1. Backend Issues:
   - Check logs for Python errors
   - Verify database connection
   - Confirm environment variables

2. Frontend Issues:
   - Check build logs
   - Verify API connectivity
   - Confirm environment variables

3. Domain Issues:
   - Verify DNS configuration
   - Check SSL certificate status
   - Confirm Telegram bot domain settings
