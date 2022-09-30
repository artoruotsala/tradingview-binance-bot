# Tradingview Binance Bot v.0.1

## Getting started

This bot places orders from Tradingview signals (webhook) to Binance. The bot can easily be deployed to AWS Lightsail.
🚧 Under a development! 🚧

- Typescript
- Docker
- Node.js
- Express
- MariaDB
- Binance SDK
- Telegram SDK

Docker compose creates two containers: bot & db

## Set envs

Copy .env.example to .env

```
BINANCE_API_KEY=
BINANCE_API_SECRET=
TELEGRAM_TOKEN_LIVE=
TELEGRAM_CHAT_ID_LIVE=
TRADE_SIZE_MAINCOIN=
TRADINGVIEW_PASSWORD=
MYSQL_ROOT_PASSWORD=
```

## Creating an Order from Tradingview

- Use alert -> webhook to your bot http://url/new-order :

```
{
	"tradingPair" : "TRXUSDT",
	"coinOne" : "TRX",
	"coinTwo" : "USDT",
	"orderType" : "SELL",
	"password" : same as TRADINGVIEW_PASSWORD env
}
```

## AWS Lightsail

- Thanks to Mike Coleman -> mikegcoleman/todo
- Edited by Arto Ruotsala
- echo script adds .env file for docker on Lightsail init

1. Launch AWS Lightsail Instance (OS Only)
2. Choose Ubuntu 20
3. Add the starting script with your envs
4. Launch!

Starting script:

```
mkdir /srv

echo $'BINANCE_API_KEY=
BINANCE_API_SECRET=
TELEGRAM_TOKEN_LIVE=
TELEGRAM_CHAT_ID_LIVE=
TRADE_SIZE_MAINCOIN=
TRADINGVIEW_PASSWORD=
MYSQL_ROOT_PASSWORD=
' > /srv/.env

curl -o lightsail-compose.sh https://raw.githubusercontent.com/artoruotsala/tradingview-binance-bot/master/lightsail-compose.sh

chmod +x ./lightsail-compose.sh

./lightsail-compose.sh

```

- Remember to add port 3306 (mysql/aurora) in Lightsail settings (to allow connections to db outside)
