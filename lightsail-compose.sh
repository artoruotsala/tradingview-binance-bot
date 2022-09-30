
#!/bin/bash

# install latest version of docker the lazy way
curl -sSL https://get.docker.com | sh

# make it so you don't need to sudo to run docker commands
usermod -aG docker ubuntu

# install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# copy the dockerfile into /srv/docker 
# if you change this, change the systemd service file to match
# WorkingDirectory=[whatever you have below]
mkdir /srv/docker
git clone https://github.com/artoruotsala/tradingview-binance-bot.git /srv/docker
mv /srv/.env /srv/docker/.env

# copy in systemd unit file and register it so our compose file runs 
# on system restart
curl -o /etc/systemd/system/docker-compose-app.service https://raw.githubusercontent.com/artoruotsala/tradingview-binance-bot/master/docker-compose-app.service
systemctl enable docker-compose-app

# start up the application via docker-compose
cd /srv/docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d