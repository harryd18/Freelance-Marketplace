# Use the official PHP Apache image
FROM php:8.2-apache

# Enable mod_rewrite (often needed for routing in PHP apps)
RUN a2enmod rewrite

# Copy your backend files into the container's web directory
COPY . /var/www/html/

# Install common PHP extensions (add more if needed)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port 80 (default for Apache)
EXPOSE 80
