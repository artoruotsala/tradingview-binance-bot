## Tradingview Binance Bot v.1.0

# Set envs

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
