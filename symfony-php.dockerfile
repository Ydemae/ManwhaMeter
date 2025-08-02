FROM php:8.3-fpm

ENV APP_ENV=prod

RUN apt-get update && apt-get install -y unzip libzip-dev libicu-dev libsodium-dev libjpeg-dev libpng-dev libwebp-dev libfreetype6-dev libpq-dev  \
    && docker-php-ext-configure gd --with-jpeg --with-freetype --with-webp \
    && docker-php-ext-install pdo_pgsql pgsql sodium zip intl opcache gd

WORKDIR /var/www/symfony

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./backend /var/www/symfony

RUN composer install --no-dev --optimize-autoloader
RUN composer require symfony/rate-limiter

RUN chmod a+rwx /var/www/symfony/data/database.db
RUN chmod -R 775 /var/www/symfony/var

COPY ./opcache.ini /usr/local/etc/php/conf.d/opcache.ini

CMD ["php-fpm"]