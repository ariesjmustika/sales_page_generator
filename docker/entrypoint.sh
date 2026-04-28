#!/bin/sh

# Exit on error
set -e

echo "🚀 Starting MarketAI Deployment..."

# Replace port 8080 with $PORT from Railway
if [ -n "$PORT" ]; then
    echo "🌍 Setting Nginx to listen on port $PORT"
    sed -i "s/8080/$PORT/g" /etc/nginx/http.d/default.conf
fi

# Fix storage permissions
chmod -R 775 storage bootstrap/cache || true
chown -R www-data:www-data storage bootstrap/cache || true

# Ensure PHP-FPM listens on 127.0.0.1:9000
sed -i 's/listen = \/.*$/listen = 127.0.0.1:9000/' /usr/local/etc/php-fpm.d/www.conf || true

# Start PHP-FPM in background
echo "🐘 Starting PHP-FPM..."
php-fpm -D

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
