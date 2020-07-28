FROM caddy:2.1.1

COPY Caddyfile /etc/caddy/
COPY ./dist/* /var/www/html/