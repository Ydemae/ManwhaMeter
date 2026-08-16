ARG PHP_IMAGE=symfony-php:latest
FROM --platform=$BUILDPLATFORM ${PHP_IMAGE} AS source

FROM nginx:alpine
COPY --from=source /var/www/symfony/public /var/www/symfony/public
COPY ./nginx/symfony.conf /etc/nginx/conf.d/default.conf
