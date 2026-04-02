# ⚡ Zappy

**The open-source automation platform for the modern web.**
*A high-performance alternative to Zapier built with Next.js and MongoDB.*

---

## 🚀 Quick Deploy (5 Minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/zappy.git
cd zappy

# Start with Docker
docker-compose up -d

# Access at http://localhost:3000
```

**That's it!** See [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for detailed instructions.

---

## Screenshots

<img width="2537" height="1396" alt="image" src="https://github.com/user-attachments/assets/243f6c21-0719-4bf6-bbea-ed56d037583d" />
<img width="2556" height="1361" alt="image" src="https://github.com/user-attachments/assets/037b09e8-3357-4ed8-ae5f-a9dad676cb5f" />
<img width="2441" height="1335" alt="image" src="https://github.com/user-attachments/assets/5c20ff45-a65f-4d7f-a937-7d2a4f3e322c" />

---

## ✨ Features

* **🎨 Visual Workflow Builder** - Drag-and-drop editor to create automations
* **🔌 Real-time Webhooks** - Instant triggers via unique API endpoints
* **🛡️ Secure Authentication** - JWT-based auth with bcrypt password hashing
* **📊 Dashboard & History** - Track active Zaps and monitor execution logs
* **⚡ High Performance** - Microservices architecture with Redis queues
* **🗄️ MongoDB Database** - Robust, scalable data storage

---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** Lucide React Icons, Sonner Toasts

**Backend:**
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB with Mongoose
- **Queue:** Redis + BullMQ
- **Auth:** JWT + Bcrypt

**Infrastructure:**
- **Deployment:** Docker + Docker Compose
- **Monitoring:** Prometheus + Grafana

---

## 📦 Quick Start

### With Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Start MongoDB and Redis
docker-compose up -d mongodb redis

# Start development server
npm run dev
```

Access:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Webhook Service:** http://localhost:5001

---

## 🧪 Testing

1. **Create Account** - Sign up at http://localhost:3000

2. **Build a Zap:**
   - Navigate to **Create Zap**
   - Select **Webhook** as trigger
   - Add an action (Email, Slack, etc.)
   - Click **Publish**

3. **Trigger Webhook:**
```bash
curl -X POST http://localhost:5000/api/v1/webhooks/trigger/YOUR_ZAP_ID \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Zappy!"}'
```

4. **Verify** - Check the Dashboard for execution logs!

---

## 📚 Documentation

- **[Deployment Guide](DEPLOY_GUIDE.md)** - Complete deployment instructions
- **[Quick Start](QUICKSTART.md)** - 5-minute setup guide
- **[Architecture](IMPLEMENTATION_SUMMARY.md)** - System overview

---

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start all services
npm run build            # Build frontend
npm run build:all        # Build everything

# Docker
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
npm run docker:logs      # View logs

# Database
npm run db:push          # Push schema (if using Drizzle)
npm run db:seed          # Seed sample data
```

---

## 🏗️ Architecture

```
┌─────────────┐
│  Frontend   │  Port 3000 (Next.js)
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│Backend API  │◄────►│  Redis       │
│Port 5000    │      │  (BullMQ)    │
└──────┬──────┘      └──────────────┘
       │
       ▼
┌──────────────┐
│  MongoDB     │
│  Port 27017  │
└──────────────┘
```

---

## 🛡️ Security Checklist

- [ ] Change default JWT_SECRET in production
- [ ] Use strong MongoDB password
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Regular backups

---

## 📝 License

MIT License - See LICENSE file

---

**Built with ❤️ for the automation community**

**Happy Automating! ⚡**
