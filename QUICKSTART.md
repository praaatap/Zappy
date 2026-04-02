# ⚡ Quick Start Guide

Get Zappy up and running in 5 minutes!

---

## Option 1: Docker Compose (Recommended)

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/zappy.git
cd zappy
```

### 2. Configure Environment

```bash
# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Update .env files with your JWT_SECRET
# Edit .env and backend/.env files
```

### 3. Start All Services

```bash
# Start everything with one command
npm run docker:up
```

### 4. Seed Database (Optional)

```bash
# Add sample templates and demo user
docker-compose exec backend-api node dist/scripts/seed.js
```

### 5. Access Zappy

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/health
- **Grafana**: http://localhost:3001 (admin/admin)

**Demo Credentials** (after seeding):
- Email: `demo@zappy.com`
- Password: `demo123`

---

## Option 2: Local Development

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### 2. Install Dependencies

```bash
npm install
cd backend && npm install && cd ..
```

### 3. Configure Database

Update `.env` with your PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/zappy"
```

### 4. Setup Database

```bash
# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

This starts:
- Next.js Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Backend Webhook: http://localhost:5001
- Backend Worker: http://localhost:5002

---

## Verify Installation

### Test Webhook Trigger

```bash
# Get a zap ID from the UI, then test:
curl -X POST http://localhost:5000/api/v1/webhooks/trigger/YOUR_ZAP_ID \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Check Service Health

```bash
# Frontend
curl http://localhost:3000

# Backend API
curl http://localhost:5000/health

# Webhook Service
curl http://localhost:5001/health
```

### View Logs

```bash
# All services
npm run docker:logs

# Specific service
docker-compose logs -f backend-api
```

---

## Common Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# Rebuild everything
npm run docker:rebuild

# View logs
npm run docker:logs

# Database commands
npm run db:push      # Push schema changes
npm run db:seed      # Seed sample data
npm run db:studio    # Open database GUI

# Build
npm run build        # Build frontend
npm run build:all    # Build everything
```

---

## Troubleshooting

### Port Already in Use

```bash
# Change ports in docker-compose.yml
# Or kill the process:
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

### Reset Everything

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Start fresh
npm run docker:up
npm run db:push
npm run db:seed
```

---

## Next Steps

1. **Create Your First Zap**
   - Go to http://localhost:3000
   - Sign up for an account
   - Create a new Zap with Webhook trigger
   - Add an action (Email, Slack, etc.)
   - Publish and test!

2. **Explore Templates**
   - Browse pre-built workflow templates
   - Use a template with one click

3. **Monitor Your Workflows**
   - Check execution history
   - View real-time logs
   - Monitor success rates

---

## Need Help?

- 📚 [Full Documentation](DEPLOYMENT.md)
- 🐛 [Report Issues](https://github.com/yourusername/zappy/issues)
- 💬 [Discord Community](https://discord.gg/zappy)

**Happy Automating! ⚡**
