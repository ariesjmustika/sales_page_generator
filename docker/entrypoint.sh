#!/bin/sh
set -e

echo "🚀 --- INVESTIGATION MODE START ---"

# 1. Force environment variables
export LOG_CHANNEL=stderr
export APP_DEBUG=true

# 📋 Print ALL variable keys to see what Railway is actually sending
echo "📋 FULL ENVIRONMENT KEYS LIST:"
printenv | cut -d= -f1 | sort
echo "--------------------------"

# Check specifically
echo "🔍 Specific variable check:"
if [ -z "$APP_KEY" ]; then echo "❌ APP_KEY: NOT_FOUND"; else echo "✅ APP_KEY: FOUND"; fi
if [ -z "$APP_DEBUG" ]; then echo "❌ APP_DEBUG: NOT_FOUND"; else echo "✅ APP_DEBUG: FOUND"; fi

# 2. Fix Port
DEPLOY_PORT=${PORT:-8080}
echo "🌍 Setting Nginx to listen on port $DEPLOY_PORT"
sed -i "s/8080/$DEPLOY_PORT/g" /etc/nginx/http.d/default.conf

# 3. Fix Permissions
echo "🔐 Fixing storage permissions..."
mkdir -p storage/logs storage/framework/sessions storage/framework/views storage/framework/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 4. Configure PHP-FPM Logging & Environment
echo "⚙️ Configuring PHP-FPM..."
sed -i 's/listen = .*$/listen = 127.0.0.1:9000/' /usr/local/etc/php-fpm.d/www.conf
sed -i '/clear_env/d' /usr/local/etc/php-fpm.d/www.conf
echo "clear_env = no" >> /usr/local/etc/php-fpm.d/www.conf
echo "catch_workers_output = yes" >> /usr/local/etc/php-fpm.d/www.conf
echo "php_flag[display_errors] = on" >> /usr/local/etc/php-fpm.d/www.conf
echo "php_admin_flag[log_errors] = on" >> /usr/local/etc/php-fpm.d/www.conf
echo "php_admin_value[error_log] = /proc/self/fd/2" >> /usr/local/etc/php-fpm.d/www.conf

# 5. Manual Cache Wipe (The ultimate fix for MissingAppKeyException)
echo "🧹 Wiping all Laravel caches manually..."
rm -f bootstrap/cache/config.php
rm -f bootstrap/cache/routes.php
rm -f bootstrap/cache/services.php
rm -f bootstrap/cache/packages.php

# Clear through artisan just in case
php artisan config:clear || true
php artisan cache:clear || true

# DO NOT run config:cache for now, let it read from ENV directly
echo "⚡ Skipping config:cache for direct ENV access..."

# 6. Start Services
echo "🐘 Starting PHP-FPM..."
php-fpm -D

echo "🌐 Starting Nginx..."
nginx -g "daemon off;"
