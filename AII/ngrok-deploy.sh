#!/bin/bash

# ============================================
# Ngrok Deployment Script for AI Dropout Project
# Using ngrok v3
# ============================================

echo "============================================"
echo "  AI Dropout Project - Ngrok Deployment"
echo "============================================"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "Error: ngrok is not installed!"
    echo "Please install ngrok first:"
    echo "  1. Go to https://ngrok.com/download"
    echo "  2. Download and extract ngrok"
    echo "  3. Add it to your PATH"
    exit 1
fi

# Check if docker is running
if ! docker info &> /dev/null; then
    echo "Error: Docker is not running!"
    echo "Please start Docker Desktop or docker daemon"
    exit 1
fi

echo ""
echo "Step 1: Starting Docker services..."
echo "--------------------------------------"
docker-compose up -d db

# Wait for database to be healthy
echo "Waiting for database to be ready..."
for i in {1..30}; do
    if docker-compose exec -T db mysqladmin ping -h localhost --silent 2>/dev/null; then
        echo "Database is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

# Start backend and frontend
docker-compose up -d backend frontend

echo ""
echo "Step 2: Waiting for services to start..."
echo "--------------------------------------"
sleep 10

# Check if services are running
echo "Checking services..."
docker-compose ps

echo ""
echo "Step 3: Starting ngrok tunnels..."
echo "--------------------------------------"

# Kill any existing ngrok processes
pkill -f "ngrok" 2>/dev/null
sleep 2

# Start ngrok with config file (using both tunnels)
echo "Starting ngrok for backend and frontend..."
ngrok start --all --log=ngrok.log &

# Wait for ngrok to initialize
sleep 5

# Wait for ngrok API to be ready
for i in {1..15}; do
    if curl -s localhost:4040/api/tunnels > /dev/null 2>&1; then
        echo "Ngrok API is ready!"
        break
    fi
    echo "Waiting for ngrok API... ($i/15)"
    sleep 2
done

echo ""
echo "============================================"
echo "  Ngrok Tunnels Created!"
echo "============================================"

# Get ngrok URLs from API
echo "Fetching tunnel URLs..."

# Get all tunnels
TUNNELS_JSON=$(curl -s localhost:4040/api/tunnels)

# Extract URLs
BACKEND_URL=$(echo "$TUNNELS_JSON" | grep -o '"public_url":"https://[^"]*"' | grep -v 'frontend' | head -1 | cut -d'"' -f4)
FRONTEND_URL=$(echo "$TUNNELS_JSON" | grep -o '"public_url":"https://[^"]*"' | grep -v 'backend' | head -1 | cut -d'"' -f4)

# Fallback: try to get from log if API fails
if [ -z "$BACKEND_URL" ]; then
    BACKEND_URL=$(grep -o 'https://[a-z0-9-]*\.ngrok-free\.app' ngrok.log | head -1)
fi
if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL=$(grep -o 'https://[a-z0-9-]*\.ngrok-free\.app' ngrok.log | tail -1)
fi

# If still empty, use a different approach
if [ -z "$BACKEND_URL" ] || [ "$BACKEND_URL" == "https://" ]; then
    BACKEND_URL=$(echo "$TUNNELS_JSON" | python3 -c "import sys,json; tunnels=json.load(sys.stdin).get('tunnels',[]); print([t['public_url'] for t in tunnels if 'backend' in t.get('name','')][0] if any('backend' in t.get('name','') for t in tunnels) else print(tunnels[0]['public_url'] if tunnels else ''))" 2>/dev/null)
fi
if [ -z "$FRONTEND_URL" ] || [ "$FRONTEND_URL" == "https://" ]; then
    FRONTEND_URL=$(echo "$TUNNELS_JSON" | python3 -c "import sys,json; tunnels=json.load(sys.stdin).get('tunnels',[]); print([t['public_url'] for t in tunnels if 'frontend' in t.get('name','')][0] if any('frontend' in t.get('name','') for t in tunnels) else print(tunnels[-1]['public_url'] if tunnels else ''))" 2>/dev/null)
fi

echo ""
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"

if [ -z "$BACKEND_URL" ] || [ -z "$FRONTEND_URL" ]; then
    echo ""
    echo "Warning: Could not automatically get URLs. Please check http://localhost:4040 for tunnel URLs"
fi

# Update frontend .env file with backend URL
echo ""
echo "Step 4: Updating frontend API configuration..."

# Create frontend directory if it doesn't exist
mkdir -p frontend

# Create .env.production file
cat > frontend/.env.production << EOF
REACT_APP_API_URL=$BACKEND_URL/api
EOF

echo "Frontend API URL set to: $BACKEND_URL/api"

# Rebuild frontend with new configuration
echo ""
echo "Step 5: Rebuilding frontend with new API URL..."
docker-compose build frontend

# Restart frontend with new configuration
docker-compose up -d frontend

# Wait for frontend to restart
sleep 5

echo ""
echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo ""
echo "Your application is now accessible at:"
echo "  - Frontend: $FRONTEND_URL"
echo "  - Backend API: $BACKEND_URL/api"
echo ""
echo "Ngrok Dashboard: http://localhost:4040"
echo ""
echo "To stop the deployment, run:"
echo "  docker-compose down"
echo "  pkill -f ngrok"
echo ""
echo "Note: ngrok free tier URLs change each time you restart"
echo "============================================"

