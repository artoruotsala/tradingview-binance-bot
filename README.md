# Tradingview Binance Bot v.1.0

## Getting started

## Set envs

Copy .env.example to .env

```
API_KEY=
API_SECRET=
TELEGRAM_TOKEN_LIVE=
TELEGRAM_CHAT_ID_LIVE=
TRADE_SIZE_MAINCOIN=100
TRADINGVIEW_PASSWORD=
MYSQL_ROOT_PASSWORD=
```

## Creating an Order

Send a POST request to localhost:3000/new-order with the following data object:

```
{
	"tradingPair" : "TRXUSDT",
	"coinOne" : "TRX",
	"coinTwo" : "USDT",
	"orderType" : "SELL",
	"password" : set password to envs
}
```

## Sail to AWS Lightsail

Thanks to Mike Coleman -> mikegcoleman/todo

```
curl -o lightsail-compose.sh https://raw.githubusercontent.com/artoruotsala/tradingview-binance-bot/master/lightsail-compose.sh

chmod +x ./lightsail-compose.sh

./lightsail-compose.sh
```
