# Set up web server.
FROM php:7.3.4-apache

# Download packages needed for installing php extensions and composer packages.
RUN apt-get update && apt-get install -y \
  zlib1g-dev \
  libzip-dev

# Download and enable required php extensions.
RUN docker-php-ext-install \
  pdo_mysql \
  zip \
  bcmath \
  calendar \
  && a2enmod rewrite \
  && service apache2 restart \
  && mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

# Enable virtual host config.
WORKDIR /etc/apache2/sites-available/
COPY vhosts.conf ./
RUN a2ensite vhosts.conf \
  && a2dissite 000-default.conf \
  && service apache2 restart
