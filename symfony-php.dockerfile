FROM php:8.3-fpm

ENV APP_ENV=prod

RUN apt-get update && apt-get install -y git unzip libzip-dev libicu-dev sqlite3 libsqlite3-dev libsodium-dev

RUN docker-php-ext-install pdo_sqlite sodium zip intl opcache

WORKDIR /var/www/symfony

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./backend /var/www/symfony

RUN composer install --no-dev --optimize-autoloader
RUN composer require symfony/rate-limiter

RUN chmod a+rwx /var/www/symfony/data/database.db
RUN chmod -R 775 /var/www/symfony/var

COPY ./opcache.ini /usr/local/etc/php/conf.d/opcache.ini

CMD ["php-fpm"]