# ⚡ Zappy - Complete Setup Instructions

## Quick Start (5 Minutes)

### Step 1: Start MongoDB and Redis

```bash
# Using Docker (easiest)
docker-compose up -d mongodb redis

# OR install locally:
# MongoDB: https://www.mongodb.com/docs/manual/installation/
# Redis: https://redis.io/download
```

### Step 2: Install Dependencies

```bash
# Install frontend
npm install

# Install backend
cd backend
npm install
cd ..
```

### Step 3: Start the Application

```bash
# Option A: Start everything with one command
npm run dev

# Option B: Start separately (in different terminals)
# Terminal 1 - Backend
cd backend && npm run dev:api

# Terminal 2 - Frontend  
npm run dev:next
```

### Step 4: Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/health
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

---

## Test the Zap Functionality

### 1. Create Account
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create an account (or use demo credentials if available)

### 2. Create Your First Zap
1. Click "Create Zap" or go to `/dashboard/zaps/new`
2. The workflow builder will open
3. A trigger node is already added (Webhook)
4. Click an action from the left sidebar (e.g., "Send Email")
5. Configure the action in the right panel
6. Click "Deploy Workflow"

### 3. View Your Zaps
1. Go to Dashboard (`/dashboard`)
2. See your active zaps
3. View stats and execution history

### 4. Trigger a Zap
```bash
# Get your zapId from the dashboard
# Then trigger it:
curl -X POST http://localhost:5000/api/v1/webhooks/trigger/YOUR_ZAP_ID \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "message": "Hello Zappy!"}'
```

### 5. Check Execution
1. Go back to Dashboard
2. See the execution in "Recent Activity"
3. Check stats updated

---

## Architecture

```
┌─────────────────┐
│   Frontend      │  Port 3000 (Next.js)
│   (Next.js)     │
│   - Dashboard   │
│   - Builder     │
│   - Auth        │
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐      ┌──────────────┐
│   Backend       │◄────►│  Redis       │
│   (Express)     │      │  (Queues)    │
│   Port 5000     │      └──────────────┘
│   - API Routes  │
│   - Webhooks    │
│   - Worker      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MongoDB       │
│   Port 27017    │
│   (Database)    │
└─────────────────┘
```

---

## Environment Variables

### Frontend (.env.local)
```bash
MONGODB_URI=mongodb://zappy:zappy_password@localhost:27017/zappy?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (backend/.env)
```bash
PORT=5000
WEBHOOK_PORT=5001
MONGO_URI=mongodb://zappy:zappy_password@localhost:27017/zappy?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

---

## Available API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Zaps/Workflows
- `GET /api/v1/zap` - List all zaps
- `POST /api/v1/zap` - Create new zap
- `GET /api/v1/zap/[id]` - Get zap details
- `PUT /api/v1/zap/[id]` - Update zap
- `DELETE /api/v1/zap/[id]` - Delete zap

### Webhooks
- `POST /api/v1/webhooks/trigger/[zapId]` - Trigger a zap
- `POST /api/hooks/catch/[zapId]` - Frontend webhook endpoint

### Stats
- `GET /api/v1/stats` - Get dashboard statistics

---

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Backend Won't Start
```bash
# Check backend logs
cd backend
npm run dev:api

# Verify MongoDB connection
# MONGO_URI in backend/.env should match your MongoDB instance
```

### Frontend Can't Connect to Backend
```bash
# Check BACKEND_URL in .env.local
# Should be: http://localhost:5000

# Verify backend is running
curl http://localhost:5000/health
```

### Zap Not Triggering
1. Check zap status is "active"
2. Verify webhook URL is correct
3. Check backend logs for errors
4. Ensure Redis is running (for job queues)

---

## Production Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# This starts:
# - MongoDB
# - Redis  
# - Frontend (port 3000)
# - Backend API (port 5000)
# - Backend Webhook (port 5001)
# - Backend Worker
```

### Environment for Production

Update `.env` and `backend/.env`:
- Change `JWT_SECRET` to a secure random string
- Use strong `MONGO_PASSWORD`
- Set `NODE_ENV=production`
- Configure your domain in CORS settings

---

## Features Working ✅

- ✅ User Authentication (Signup/Login)
- ✅ Create Zaps (Visual Builder)
- ✅ List Zaps (Dashboard)
- ✅ View Zap Details
- ✅ Trigger Zaps via Webhook
- ✅ Execution Tracking
- ✅ Dashboard Statistics
- ✅ Activity Feed
- ✅ MongoDB Database
- ✅ Redis Job Queues
- ✅ Backend Worker Processing

---

**You're all set! Start automating with Zappy! ⚡**
