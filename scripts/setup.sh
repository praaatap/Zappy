#!/bin/bash
# Zappy Deployment Setup Script
# This script helps you set up and deploy Zappy

set -e

echo "⚡ Zappy Deployment Setup"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and update your database credentials${NC}"
    echo ""
fi

# Check if backend/.env file exists
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}Creating backend/.env file from template...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env file${NC}"
    echo ""
fi

# Ask user for deployment type
echo "Select deployment type:"
echo "1) Docker Compose (Recommended)"
echo "2) Local Development"
echo "3) Production (Kubernetes)"
read -p "Enter choice [1-3]: " deployment_type

case $deployment_type in
    1)
        echo ""
        echo -e "${GREEN}Starting Docker Compose deployment...${NC}"
        
        # Pull images
        echo "Pulling Docker images..."
        docker-compose pull
        
        # Start services
        echo "Starting services..."
        docker-compose up -d
        
        echo ""
        echo -e "${GREEN}✓ Deployment complete!${NC}"
        echo ""
        echo "Services running:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend API: http://localhost:5000"
        echo "  - Webhook Service: http://localhost:5001"
        echo "  - Grafana: http://localhost:3001 (admin/admin)"
        echo "  - Prometheus: http://localhost:9090"
        echo ""
        echo "To view logs: docker-compose logs -f"
        echo "To stop: docker-compose down"
        ;;
        
    2)
        echo ""
        echo -e "${GREEN}Setting up local development...${NC}"
        
        # Install dependencies
        echo "Installing root dependencies..."
        npm install
        
        echo "Installing backend dependencies..."
        cd backend && npm install && cd ..
        
        # Run database migrations
        echo ""
        echo "Running database migrations..."
        npm run db:push || echo -e "${YELLOW}⚠  Database migration failed. Check your DATABASE_URL${NC}"
        
        echo ""
        echo -e "${GREEN}✓ Setup complete!${NC}"
        echo ""
        echo "To start development server:"
        echo "  npm run dev"
        echo ""
        echo "This will start:"
        echo "  - Next.js Frontend: http://localhost:3000"
        echo "  - Backend API: http://localhost:5000"
        echo "  - Backend Webhook: http://localhost:5001"
        echo "  - Backend Worker: http://localhost:5002"
        ;;
        
    3)
        echo ""
        echo -e "${YELLOW}Kubernetes deployment selected${NC}"
        echo "See k8s/README.md for Kubernetes deployment instructions"
        echo ""
        echo "Quick start:"
        echo "  kubectl apply -f k8s/namespace.yaml"
        echo "  kubectl apply -f k8s/configmap.yaml"
        echo "  kubectl apply -f k8s/secrets.yaml"
        echo "  kubectl apply -f k8s/postgres.yaml"
        echo "  kubectl apply -f k8s/redis.yaml"
        echo "  kubectl apply -f k8s/backend.yaml"
        echo "  kubectl apply -f k8s/frontend.yaml"
        ;;
        
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Happy automating with Zappy! ⚡${NC}"
