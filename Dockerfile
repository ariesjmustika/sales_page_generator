FROM richarvey/php-apache-heroku:latest

# Set working directory
WORKDIR /var/www/app

# Copy all files
COPY . .

# Set Environment Variables for Build
ENV WEBROOT /var/www/app/public
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV NODE_VERSION 18

# Install dependencies (PHP & Node)
RUN composer install --no-interaction --no-dev --optimize-autoloader
RUN npm install && npm run build

# Setup Permissions
RUN chown -R www-data:www-data /var/www/app/storage /var/www/app/bootstrap/cache
RUN chmod -R 775 /var/www/app/storage /var/www/app/bootstrap/cache

# Expose port
EXPOSE 80
