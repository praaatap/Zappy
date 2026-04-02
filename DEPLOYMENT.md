# 🚀 Zappy Deployment Guide

Complete guide for deploying Zappy to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Docker Compose Deployment](#docker-compose-deployment)
5. [Production Deployment with Nginx](#production-deployment-with-nginx)
6. [Kubernetes Deployment](#kubernetes-deployment)
7. [Database Setup](#database-setup)
8. [Monitoring & Observability](#monitoring--observability)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** v18 or higher
- **Docker** v20+ and **Docker Compose** v2+
- **PostgreSQL** v15+ (or use the included container)
- **Redis** v7+ (or use the included container)

### Optional
- **kubectl** for Kubernetes deployment
- **OpenSSL** for SSL certificate generation

---

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/zappy.git
cd zappy

# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configure Environment

```bash
# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env

# Edit with your credentials
nano .env
nano backend/.env
```

### 3. Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

---

## Environment Configuration

### Root `.env` File

```bash
# Database
DATABASE_URL="postgresql://zappy:your_secure_password@localhost:5432/zappy"

# JWT Authentication
JWT_SECRET="generate-a-secure-secret-key-here"
JWT_EXPIRY="7d"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://your-domain.com

# Rate Limiting
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Backend `.env` File

```bash
# Server
PORT=5000
WEBHOOK_PORT=5001
NODE_ENV=production

# Database
DATABASE_URL="postgresql://zappy:your_secure_password@postgres:5432/zappy"

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET="same-secret-as-root-env"

# CORS
ALLOWED_ORIGINS=https://your-domain.com
```

### Generate Secure JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Docker Compose Deployment

### Development Mode

```bash
# Start with hot-reloading
docker-compose -f docker-compose.dev.yml up -d

# View specific service logs
docker-compose logs -f backend-api
docker-compose logs -f frontend
```

### Production Mode

```bash
# Start production services
docker-compose up -d

# Scale worker instances
docker-compose up -d --scale backend-worker=3

# Update services after code changes
docker-compose build
docker-compose up -d --force-recreate
```

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js Application |
| Backend API | 5000 | Express API Server |
| Backend Webhook | 5001 | Webhook Ingestion |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache & Queue |
| Grafana | 3001 | Monitoring Dashboard |
| Prometheus | 9090 | Metrics Collection |

---

## Production Deployment with Nginx

### 1. Generate SSL Certificates

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem

# For production, use Let's Encrypt
certbot certonly --webroot -w /var/www/html -d your-domain.com
```

### 2. Configure Nginx

Edit `nginx/nginx.conf` and update:
- `server_name` to your domain
- SSL certificate paths
- Upstream server addresses

### 3. Start with Nginx

```bash
docker-compose -f docker-compose.nginx.yml up -d
```

### 4. Verify Deployment

```bash
# Check Nginx configuration
docker exec zappy-nginx nginx -t

# Test HTTPS endpoint
curl -k https://your-domain.com/health

# View Nginx logs
docker logs zappy-nginx
```

---

## Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### 2. Configure Secrets

```bash
# Create secrets
kubectl create secret generic zappy-secrets \
  --from-literal=jwt-secret=$(openssl rand -base64 32) \
  --from-literal=postgres-password=$(openssl rand -base64 32) \
  --namespace=zappy
```

### 3. Deploy Infrastructure

```bash
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
```

### 4. Deploy Application

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n zappy

# Check services
kubectl get svc -n zappy

# View logs
kubectl logs -f deployment/zappy-backend -n zappy
```

---

## Database Setup

### Using Drizzle ORM

```bash
# Push schema to database
npm run db:push

# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate
```

### Seed Database

```bash
# Run seed script
node scripts/seed.js

# Or with Docker
docker-compose exec backend-api node dist/scripts/seed.js
```

### Database Backup

```bash
# Backup PostgreSQL
docker exec zappy-postgres pg_dump -U zappy zappy > backup.sql

# Restore from backup
docker exec -i zappy-postgres psql -U zappy zappy < backup.sql
```

---

## Monitoring & Observability

### Prometheus Metrics

Access metrics at: http://localhost:9090

Key metrics:
- `zappy_api_http_requests_total` - Total HTTP requests
- `zappy_api_process_cpu_seconds_total` - CPU usage
- `zappy_api_process_resident_memory_bytes` - Memory usage

### Grafana Dashboards

Access at: http://localhost:3001 (admin/admin)

1. Add Prometheus as a data source
2. Import dashboard from `grafana/dashboards/`
3. Create custom panels for:
   - Request rate
   - Error rate
   - Response time
   - Queue depth

### Application Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend-worker

# Export logs
docker-compose logs backend-api > backend-api.log
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U zappy -d zappy
```

#### 2. Redis Connection Issues

```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

#### 3. Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
```

#### 4. Build Failures

```bash
# Clear cache and rebuild
docker-compose build --no-cache
docker-compose up -d

# Check Node version
node -v  # Should be 18+

# Reinstall dependencies
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install
```

#### 5. Migration Errors

```bash
# Reset database (WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d postgres
npm run db:push
node scripts/seed.js
```

### Health Checks

```bash
# Frontend
curl http://localhost:3000/health

# Backend API
curl http://localhost:5000/health

# Check all services
docker-compose ps
```

### Performance Tuning

#### Increase Worker Replicas

```yaml
# docker-compose.yml
backend-worker:
  deploy:
    replicas: 3
```

#### Adjust Rate Limits

```bash
# .env
RATE_LIMIT_MAX_REQUESTS=200
RATE_LIMIT_WINDOW=60000
```

#### Database Connection Pool

```bash
# backend/.env
DATABASE_POOL_SIZE=20
DATABASE_IDLE_TIMEOUT=30000
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate secure JWT secrets
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/zappy/issues
- Documentation: https://zappy.dev/docs
- Discord: https://discord.gg/zappy

---

**Happy Deploying! ⚡**
