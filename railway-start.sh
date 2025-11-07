#!/bin/bash
set -e

echo "🚀 Starting Cost Engine deployment..."

# Navigate to costs service
cd services/costs

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔨 Building application..."
pnpm run build

echo "🗄️ Running database migrations..."
pnpm run migrate || echo "⚠️ Migrations failed or already applied"

echo "✨ Starting server..."
exec node dist/main.js
