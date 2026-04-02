# ⚡ Zappy - Deployment Guide

Get Zappy deployed TODAY! 🚀

---

## Quick Deploy (5 Minutes)

### Option 1: Docker Compose (EASIEST - RECOMMENDED)

```bash
# 1. Clone and start
git clone https://github.com/yourusername/zappy.git
cd zappy

# 2. Start all services with Docker
docker-compose up -d

# 3. That's it! Access at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/health
```

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Start MongoDB and Redis (or use Docker)
docker-compose up -d mongodb redis

# 3. Start development servers
npm run dev

# Access at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## What You Get

✅ **Full-Stack Automation Platform**
- Visual workflow builder
- Real-time webhook triggers  
- JWT authentication
- Dashboard & analytics
- Execution history

✅ **Microservices Architecture**
- Frontend (Next.js)
- Backend API (Express)
- Webhook Service
- Worker Service (Queue processor)

✅ **Database & Cache**
- MongoDB (data storage)
- Redis (job queues)

---

## Testing

### 1. Create Account
Go to http://localhost:3000 and sign up

### 2. Create a Zap
- Click "Create Zap"
- Choose "Webhook" as trigger
- Choose an action (Email, Slack, etc.)
- Publish

### 3. Trigger Webhook
```bash
curl -X POST http://localhost:5000/api/v1/webhooks/trigger/YOUR_ZAP_ID \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Zappy!"}'
```

### 4. Check Dashboard
View execution history in the dashboard!

---

## Production Deployment

### Update .env for Production

```bash
# Change these in .env:
JWT_SECRET=<generate-strong-secret>
MONGO_PASSWORD=<strong-password>
NODE_ENV=production
```

### Deploy with Docker

```bash
# Build and start
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Ports Used

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Backend API | 5000 |
| Webhook Service | 5001 |
| MongoDB | 27017 |
| Redis | 6379 |

---

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check MongoDB is running
docker-compose ps mongodb

# View logs
docker-compose logs mongodb
```

### Port Already in Use
```bash
# Change port in .env
FRONTEND_PORT=3001
BACKEND_API_PORT=5001
```

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d
```

---

## Architecture

```
┌─────────────┐
│  Frontend   │  Port 3000
│  (Next.js)  │
└──────┬──────┘
       │
       │ API Calls
       ▼
┌─────────────┐      ┌──────────────┐
│Backend API  │◄────►│  Redis       │
│(Express)    │      │  (Queues)    │
│Port 5000    │      └──────────────┘
└──────┬──────┘
       │
       │
       ▼
┌──────────────┐
│  MongoDB     │
│  (Database)  │
└──────────────┘
```

---

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

**Backend:**
- Express.js
- MongoDB with Mongoose
- Redis with BullMQ
- JWT Authentication

**Infrastructure:**
- Docker & Docker Compose
- Prometheus (monitoring)
- Grafana (dashboards)

---

## Next Steps

1. ✅ Deploy locally with Docker
2. ✅ Create your first automation
3. ✅ Customize for your needs
4. 🚀 Deploy to production (VPS, AWS, etc.)

---

**Need Help?**

Check the full documentation or open an issue on GitHub.

**Happy Automating! ⚡**
