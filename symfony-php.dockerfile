FROM php:8.3-fpm

ENV APP_ENV=prod

RUN apt-get update && apt-get install -y unzip libzip-dev libicu-dev libsodium-dev libjpeg-dev libpng-dev libwebp-dev libfreetype6-dev libpq-dev  \
    && docker-php-ext-configure gd --with-jpeg --with-freetype --with-webp \
    && docker-php-ext-install pdo_pgsql pgsql sodium zip intl opcache gd

WORKDIR /var/www/symfony

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./backend /var/www/symfony

RUN composer install --no-dev --optimize-autoloader --no-scripts

RUN mkdir -p /var/www/symfony/var && chown -R www-data:www-data /var/www/symfony/var && chmod -R 775 /var/www/symfony/var \
    && mkdir -p /var/www/symfony/public/images && chown -R www-data:www-data /var/www/symfony/public/images && chmod -R 775 /var/www/symfony/public/images

COPY ./opcache.ini /usr/local/etc/php/conf.d/opcache.ini

COPY ./custom.ini /usr/local/etc/php/conf.d/custom.ini

CMD ["php-fpm"]