import ccxt from 'ccxt'

export const binanceClient = new ccxt.binance({
  apiKey: process.env.BINANCE_API_KEY!,
  secret: process.env.BINANCE_API_SECRET!,
  enableRateLimit: true,
})

type Tickers = {
  [key: string]: {
    symbol: string
    precision: number
    minQty: number
    minNotional: number
  }
}

export const TICKERS: Tickers = {}

export const initExchangeData = async () => {
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

export async function fetchBalance(): Promise<ccxt.Balances> {
  try {
    if (!binanceClient) return Promise.reject('binance client not initialized')
    return await binanceClient.fetchBalance()
  } catch (error) {
    return Promise.reject(error)
  }
}

// export async function createSpotOrder(
//   symbol: string,
//   type: 'market' | 'limit',
//   side: 'buy' | 'sell',
//   amount: number,
//   price?: number,
//   params?: ccxt.Params
// ): Promise<ccxt.Order> {
//   try {
//     if (!binanceClient) return Promise.reject('binance client not initialized')
//     return await binanceClient.createOrder(
//       symbol,
//       type,
//       side,
//       amount,
//       price,
//       params
//     )
//     binanceClient.ord
//   } catch (error) {
//     return Promise.reject(error)
//   }
// }

export async function createMarketOrder(
  symbol: string,
  side: 'buy' | 'sell',
  amount: number,
  price?: number,
  params?: ccxt.Params
): Promise<ccxt.Order> {
  try {
    if (!binanceClient) return Promise.reject('binance client not initialized')
    return await binanceClient.createMarketOrder(
      symbol,
      side,
      amount,
      price,
      params
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function marginBorrow(
  asset: string,
  amount: number,
  timestamp: number
): Promise<ccxt.Order> {
  try {
    if (!binanceClient) return Promise.reject('binance client not initialized')
    return await binanceClient.sapiPostMarginLoan({
      asset,
      isIsolated: false,
      amount,
      timestamp,
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function marginRepay(
  asset: string,
  amount: number,
  timestamp: number
): Promise<ccxt.Order> {
  try {
    if (!binanceClient) return Promise.reject('binance client not initialized')
    return await binanceClient.sapiPostMarginRepay({
      asset,
      isIsolated: false,
      amount,
      timestamp,
    })
  } catch (error) {
    return Promise.reject(error)
  }
}
