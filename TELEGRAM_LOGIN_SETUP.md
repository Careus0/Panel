# Telegram Login Integration Setup

## Overview
This application uses Telegram Login Widget for secure authentication. The system consists of a FastAPI backend and Next.js frontend, with Telegram authentication integrated for user login.

## Frontend Setup (Next.js)

### Login Component
The login form (`frontend/src/components/auth/login-form.tsx`) implements the Telegram Login Widget:
- Uses the official Telegram Widget script
- Handles authentication data received from Telegram
- Manages login state through React Context
- Provides user feedback through toast notifications

### Authentication Context
The auth context (`frontend/src/contexts/auth-context.tsx`) manages:
- User authentication state
- Token management
- Session persistence
- Automatic token refresh

### Auth Service
The auth service (`frontend/src/lib/auth.ts`) handles:
- API communication with backend
- Token storage and management
- Session management
- Automatic token refresh logic

## Backend Setup (FastAPI)

### Authentication API
The auth API (`backend/app/api/auth.py`) provides:
- Telegram login endpoint (`/api/v1/auth/telegram`)
- Logout endpoint (`/api/v1/auth/logout`)
- Token refresh endpoint (`/api/v1/auth/refresh-token`)

### Security Features
1. **Telegram Auth Verification**
   - Validates Telegram authentication data
   - Verifies auth_date to prevent replay attacks
   - Uses Telegram's hash verification

2. **Session Management**
   - Creates and manages user sessions
   - Handles token expiration
   - Implements secure token refresh mechanism

3. **Rate Limiting**
   - Implements rate limiting on auth endpoints
   - Prevents brute force attacks

## Database Models

### User Model
- Stores user information from Telegram
- Fields:
  - telegram_id
  - username
  - first_name
  - last_name
  - photo_url
  - is_active
  - created_at
  - updated_at

### Session Model
- Manages active user sessions
- Fields:
  - user_id
  - token
  - expires_at
  - is_active
  - user_agent
  - ip_address

## Setup Instructions

1. **Telegram Bot Setup**
   - Create a bot through @BotFather
   - Get the bot token and username
   - Configure allowed domains for the login widget using `/setdomain` command
   - Add domain: `careus-001-site1.mtempurl.com`

2. **Environment Configuration**
   - Frontend:
     ```env
     NEXT_PUBLIC_API_URL=http://careus-001-site1.mtempurl.com
     NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=Mr_Sakamotobot
     ```
   - Backend:
     ```env
     TELEGRAM_BOT_TOKEN=your_bot_token
     ```

3. **Running the Application**
   - Start the backend:
     ```bash
     cd backend
     python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
     ```
   - Start the frontend:
     ```bash
     cd frontend
     yarn dev
     ```

4. **Domain Configuration**
   - The Telegram widget is configured to use production domain: `http://careus-001-site1.mtempurl.com`
   - Ensure this domain is whitelisted in @BotFather settings
   - For local development, the widget will still work once domain is configured

## Security Considerations

1. **Token Security**
   - Short-lived access tokens (30 minutes)
   - Secure token refresh mechanism
   - Token invalidation on logout

2. **Data Protection**
   - Secure storage of user data
   - Encrypted session tokens
   - Protection against common attacks

3. **Authentication Flow**
   - Validates Telegram auth data
   - Verifies auth_date freshness
   - Implements rate limiting
   - Uses secure session management

## Testing

The authentication system includes test files:
- `backend/test_telegram_auth.py`: Tests Telegram authentication
- `backend/test_api.py`: Tests API endpoints
- `backend/test_complete_api.py`: End-to-end API tests

## Troubleshooting

1. **Telegram Widget Not Loading**
   - Ensure domain is whitelisted in @BotFather settings
   - Check bot username in login-form.tsx
   - Verify Telegram widget script is loading

2. **Authentication Failures**
   - Check bot token configuration
   - Verify auth data hash calculation
   - Ensure clock synchronization for auth_date verification

3. **Session Issues**
   - Check token expiration settings
   - Verify refresh token mechanism
   - Monitor session cleanup
