#!/bin/bash
set -e

echo "🚀 Starting postgres container..."
docker compose -f ./docker/docker-compose.yml up -d

#wait for postgres to be ready
echo "⏳ waiting for postgres to be ready..."
until docker exec postgres_db pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done

echo "✅ postgres is ready"

echo "📦 Running Prisma migrations..."

npx prisma generate
npx prisma migrate dev

echo "⚡ completed !!!"