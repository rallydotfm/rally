#!/bin/sh
# This script will write all of your configurations to /opt/livekit.
# It'll also install LiveKit as a systemd service that will run at startup
# LiveKit will be started automatically at machine startup.

# create directories for LiveKit
mkdir -p /opt/livekit/caddy_data
mkdir -p /usr/local/bin

# Docker & Docker Compose will need to be installed on the machine
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
sh /tmp/get-docker.sh
curl -L "https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod 755 /usr/local/bin/docker-compose

sudo systemctl enable docker

# livekit config
cat << EOF > /opt/livekit/livekit.yaml
port: 7880
rtc:
    tcp_port: 7881
    port_range_start: 50000
    port_range_end: 60000
    use_external_ip: true
redis:
    address: localhost:6379
    username: ""
    password: ""
    db: 0
turn:
    enabled: true
    domain: turn.letsrally.fm
    cert_file: ""
    key_file: ""
    tls_port: 5349
    udp_port: 443
    external_tls: true
keys:
    APIoHBid8m3ZUqP: VQQBJuViZafmtbXMpi3Vz8lZ2KZGkIgsg3OgcjYtEdA


EOF

# caddy config
cat << EOF > /opt/livekit/caddy.yaml
logging:
  logs:
    default:
      level: INFO
storage:
  "module": "file_system"
  "root": "/data"
apps:
  tls:
    certificates:
      automate:
        - alpha.letsrally.fm
        - turn.letsrally.fm
  layer4:
    servers:
      main:
        listen: [":443"]
        routes:
          - match:
            - tls:
                sni:
                  - "turn.letsrally.fm"
            handle:
              - handler: tls
              - handler: proxy
                upstreams:
                  - dial: ["localhost:5349"]
          - match:
              - tls:
                  sni:
                    - "alpha.letsrally.fm"
            handle:
              - handler: tls
                connection_policies:
                  - alpn: ["http/1.1"]
              - handler: proxy
                upstreams:
                  - dial: ["localhost:7880"]

EOF

# update ip script
cat << "EOF" > /opt/livekit/update_ip.sh
#!/usr/bin/env bash
ip=`ip addr show |grep "inet " |grep -v 127.0.0. |head -1|cut -d" " -f6|cut -d/ -f1`
sed -i.orig -r "s/\\\"(.+)(\:5349)/\\\"$ip\2/" /opt/livekit/caddy.yaml


EOF

# docker compose
cat << EOF > /opt/livekit/docker-compose.yaml
# LiveKit requires host networking, which is only available on Linux
# This compose will not function correctly on Mac or Windows
version: "3.9"
services:
  caddy:
    image: livekit/caddyl4
    command: run --config /etc/caddy.yaml --adapter yaml
    restart: unless-stopped
    network_mode: "host"
    volumes:
      - ./caddy.yaml:/etc/caddy.yaml
      - ./caddy_data:/data
  livekit:
    image: livekit/livekit-server:latest
    command: --config /etc/livekit.yaml
    restart: unless-stopped
    network_mode: "host"
    volumes:
      - ./livekit.yaml:/etc/livekit.yaml
  redis:
    image: redis:6-alpine
    command: redis-server /etc/redis.conf
    network_mode: "host"
    volumes:
      - ./redis.conf:/etc/redis.conf


EOF

# systemd file
cat << EOF > /etc/systemd/system/livekit-docker.service
[Unit]
Description=LiveKit Server Container
After=docker.service
Requires=docker.service

[Service]
LimitNOFILE=500000
Restart=always
WorkingDirectory=/opt/livekit
# Shutdown container (if running) when unit is started
ExecStartPre=/usr/local/bin/docker-compose -f docker-compose.yaml down
ExecStart=/usr/local/bin/docker-compose -f docker-compose.yaml up
ExecStop=/usr/local/bin/docker-compose -f docker-compose.yaml down

[Install]
WantedBy=multi-user.target


EOF
# redis config
cat << EOF > /opt/livekit/redis.conf
bind 127.0.0.1 ::1
protected-mode yes
port 6379
timeout 0
tcp-keepalive 300


EOF

chmod 755 /opt/livekit/update_ip.sh
/opt/livekit/update_ip.sh

systemctl enable livekit-docker
systemctl start livekit-docker
