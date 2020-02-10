FROM abiosoft/caddy:1.0.3

EXPOSE 80 443 2015
VOLUME /root/.caddy /srv
WORKDIR /srv

COPY ./dist/* /srv/