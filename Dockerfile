# Set up web server.
FROM jlwalkerlg/php7.3.4-laravel:prod

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

# Enable virtual host config.
WORKDIR /etc/apache2/sites-available/
COPY vhosts.conf ./
RUN a2ensite vhosts.conf \
  && a2dissite 000-default.conf \
  && service apache2 restart
