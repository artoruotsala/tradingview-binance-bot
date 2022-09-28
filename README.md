## Tradingview Binance Bot v.1.0

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
