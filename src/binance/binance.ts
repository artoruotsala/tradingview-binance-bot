import ccxt from 'ccxt'

type Tickers = {
  [key: string]: {
    symbol: string
    precision: number
    minQty: number
    minNotional: number
  }
}

export const TICKERS: Tickers = {}

export const initExchangeData = async (binanceClient: ccxt.binance) => {
  return new Promise((resolve, reject) => {
    binanceClient
      .loadMarkets()
      .then((result) => {
        const markets: ccxt.Market = JSON.parse(JSON.stringify(result))
        Object.values(markets).forEach((key) => {
          if (key.active) {
            TICKERS[key.id] = {
              symbol: key.id,
              precision: key.precision.price,
              minQty: key.limits.amount.min,
              minNotional: key.limits.cost.min,
            }
          }
        })
      })
      .then(() => {
        resolve('done')
      })
      .catch((err) => {
        console.error('getExchangeInfo init error: ', err)
        reject(err)
      })
  })
}
