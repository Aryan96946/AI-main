# Ngrok Deployment Guide for AI Dropout Prediction Project

This guide provides step-by-step instructions to deploy your AI Dropout Prediction project using ngrok for public access.

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        ngrok                                │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │   Frontend (3000)    │    │     Backend API (5000)   │  │
│  │   https://xxx.io     │    │     https://xxx.io/api   │  │
│  └──────────────────────┘    └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │                                    │
          ▼                                    ▼
┌─────────────────────┐          ┌─────────────────────────┐
│   React Frontend    │          │    Flask Backend        │
│   (Docker Port 3000)│          │    (Docker Port 5000)   │
└─────────────────────┘          └─────────────────────────┘
                                              │
                                              ▼
                                   ┌─────────────────────────┐
                                   │    MySQL Database      │
                                   │    (Docker Port 3307)   │
                                   └─────────────────────────┘
```

---

## Prerequisites

1. **Docker & Docker Compose** - Install from [docker.com](https://www.docker.com/)
2. **ngrok** - Install from [ngrok.com](https://ngrok.com/download)
3. **MySQL Client** (optional) - For database verification

---

## Installation Steps

### Step 1: Install ngrok

#### Option A: Download binary (Recommended)

```bash
# Download ngrok
curl -s https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip -o ngrok.zip

# Unzip
unzip ngrok.zip

# Move to PATH
sudo mv ngrok /usr/local/bin/

# Verify
ngrok version
```

#### Option B: Using package manager

```bash
# On Ubuntu/Debian
sudo apt install unzip
curl -fsSL https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip -o ngrok.zip
unzip ngrok.zip
sudo mv ngrok /usr/local/bin/
```

### Step 2: Authenticate ngrok (Optional for basic usage)

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

Get your auth token from [ngrok dashboard](https://dashboard.ngrok.com/auth).

---

## Deployment Procedures

### Method 1: Using the Deployment Script (Recommended)

```bash
# Make the script executable
chmod +x ngrok-deploy.sh

# Run the deployment script
./ngrok-deploy.sh
```

### Method 2: Manual Deployment

#### Step 1: Start Docker Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

#### Step 2: Wait for Services to Initialize

```bash
# Wait about 15-20 seconds for database to be ready
sleep 20
```

#### Step 3: Create ngrok Tunnels

**Terminal 1 - Backend Tunnel:**
```bash
ngrok http 5000 --log=stdout > ngrok_backend.log &
```

**Terminal 2 - Frontend Tunnel:**
```bash
ngrok http 3000 --log=stdout > ngrok_frontend.log &
```

#### Step 4: Get ngrok URLs

```bash
# For backend
curl -s localhost:4040/api/tunnels | python3 -c "import sys,json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])"

# For frontend  
curl -s localhost:4041/api/tunnels | python3 -c "import sys,json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])"
```

Or view the ngrok dashboard at: http://localhost:4040

#### Step 5: Update Frontend Configuration

Create `frontend/.env.production` with:
```
REACT_APP_API_URL=https://your-ngrok-backend-url/api
```

Then rebuild frontend:
```bash
docker-compose build frontend
docker-compose up -d frontend
```

---

## Configuration Files Created/Modified

### 1. `ngrok-deploy.sh` - Deployment Script
Auto-starts all services and creates ngrok tunnels.

### 2. Frontend Environment (`.env.production`)
```env
REACT_APP_API_URL=https://your-ngrok-url.io/api
```

### 3. Backend Configuration
The backend already reads from environment variables. Update if needed:
```bash
# In docker-compose.yml, ensure:
- DATABASE_URI=mysql+pymysql://aryan:password@db:3306/aidropout
```

---

## Verification Steps

### Check Running Containers
```bash
docker-compose ps
```

Expected output:
```
NAME                IMAGE               COMMAND              STATUS
ai_db_1             mysql:8.0           "docker-entrypoint…"   Up
ai_backend_1        ai_backend          "/app/entrypoint.sh"   Up
ai_frontend_1       ai_frontend         "docker-entrypoint…"   Up
```

### Check ngrok Tunnels
```bash
curl -s localhost:4040/api/tunnels
```

### Test Backend API
```bash
# Replace with your ngrok URL
curl https://your-ngrok-url.io/api/health
```

### Test Frontend
```
Open https://your-ngrok-url.io in browser
```

---

## Troubleshooting

### 🚀 Network Fix Applied
- Frontend no longer uses hardcoded localhost API
- docker-compose now uses `${REACT_APP_API_URL}` env var
- **Always run `./ngrok-deploy.sh`** for external device testing

### Issue: Database Connection Failed

```bash
# Check database logs
docker-compose logs db

# Wait longer for database to initialize
docker-compose restart db
sleep 30
```

### Issue: ngrok Tunnel Not Starting

```bash
# Check if port is in use
lsof -i :5000
lsof -i :3000

# Check ngrok logs
cat ngrok_backend.log
```

### Issue: Frontend Not Connecting to Backend

1. Verify backend is running: `docker-compose logs backend`
2. Check ngrok URL is correct in frontend `.env.production`
3. Rebuild frontend: `docker-compose build frontend && docker-compose up -d frontend`

### Issue: CORS Errors

The backend already has CORS configured. If issues persist, check:
```python
# In backend/app.py
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

---

## Important Notes

### 1. ngrok Free Tier Limitations
- **URL changes** every time you restart ngrok
- **3 connections** limit on free tier
- **Tunnel timeout** after 2 hours of inactivity
- For persistent URL, upgrade to ngrok paid plan

### 2. Security Considerations
- ngrok URLs are public - anyone with the link can access
- Do not share URLs publicly for production data
- Consider using ngrok authentication (basic auth or IP restrictions)

### 3. For Production Deployment
For a permanent deployment, consider:
- Deploying to cloud services (AWS, GCP, Azure, Heroku, Render)
- Using a reverse proxy (Nginx) with proper SSL
- Using Docker Swarm or Kubernetes

---

## Quick Reference Commands

```bash
# Start deployment
./ngrok-deploy.sh

# Check status
docker-compose ps
curl -s localhost:4040/api/tunnels

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop everything
docker-compose down
pkill -f ngrok

# Restart
docker-compose restart
```

---

## Support

If you encounter issues:
1. Check Docker logs: `docker-compose logs`
2. Check ngrok logs: `cat ngrok_backend.log`
3. Verify ports are available: `netstat -tulpn | grep -E '3000|5000'`

