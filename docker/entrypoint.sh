#!/bin/sh

# Exit on error
set -e

echo "🚀 Starting MarketAI Deployment..."

# Wait for database if needed (optional)
# sleep 5

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations
echo "📂 Running migrations..."
php artisan migrate --force

# Cache config and routes for performance
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM in background
php-fpm -D

# Start Nginx in foreground
echo "🌐 Starting Nginx..."
nginx -g "daemon off;"
