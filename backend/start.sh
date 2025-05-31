#!/bin/bash

# Backend startup script for Pterodactyl

echo "Starting Sentinel Backend..."

# Install dependencies if requirements.txt is newer than last install
if [ requirements.txt -nt .requirements_installed ] || [ ! -f .requirements_installed ]; then
    echo "Installing Python dependencies..."
    pip install --no-cache-dir -r requirements.txt
    touch .requirements_installed
fi

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Create initial data if needed
echo "Creating initial data..."
python -c "
try:
    from app.initial_data import create_initial_data
    create_initial_data()
    print('Initial data created successfully')
except Exception as e:
    print(f'Initial data creation failed or already exists: {e}')
"

# Start the application
echo "Starting FastAPI server..."
exec python -m uvicorn main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000} --workers 1
