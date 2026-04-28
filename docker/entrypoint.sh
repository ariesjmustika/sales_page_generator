#!/bin/sh
set -e

echo "🚀 --- INVESTIGATION MODE START ---"

# 1. Force environment variables for debugging
export LOG_CHANNEL=stderr
export APP_DEBUG=true

# 2. Fix Port
DEPLOY_PORT=${PORT:-8080}
echo "🌍 Setting Nginx to listen on port $DEPLOY_PORT"
sed -i "s/8080/$DEPLOY_PORT/g" /etc/nginx/http.d/default.conf

# 3. Fix Permissions
echo "🔐 Fixing storage permissions..."
mkdir -p storage/logs storage/framework/sessions storage/framework/views storage/framework/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 4. Configure PHP-FPM Logging & Environment (MUST BE BEFORE PHP-FPM STARTS)
echo "⚙️ Configuring PHP-FPM for debug logs..."
sed -i 's/listen = .*$/listen = 127.0.0.1:9000/' /usr/local/etc/php-fpm.d/www.conf
echo "clear_env = no" >> /usr/local/etc/php-fpm.d/www.conf
echo "catch_workers_output = yes" >> /usr/local/etc/php-fpm.d/www.conf
echo "php_flag[display_errors] = on" >> /usr/local/etc/php-fpm.d/www.conf
echo "php_admin_flag[log_errors] = on" >> /usr/local/etc/php-fpm.d/www.conf
echo "php_admin_value[error_log] = /proc/self/fd/2" >> /usr/local/etc/php-fpm.d/www.conf

# 5. Laravel Setup
echo "🧹 Clearing caches..."
php artisan config:clear || true
php artisan route:clear || true

# Check/Generate Key
if [ -z "$APP_KEY" ]; then
    echo "🔑 APP_KEY missing, generating a temporary one..."
    php artisan key:generate --show --no-interaction
fi

echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache

# 6. Start Services (MUST BE AT THE END)
echo "🐘 Starting PHP-FPM..."
php-fpm -D

echo "🌐 Starting Nginx..."
nginx -g "daemon off;"
