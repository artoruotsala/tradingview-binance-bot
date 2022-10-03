import { AvgPriceResult } from 'binance-api-node'
import { TICKERS, binanceClient } from './binance'
import { getTrades } from '../db/getTrades'

export class TradeSize {
  private static TRADE_SIZE = parseFloat(process.env.TRADE_SIZE_MAINCOIN!) || 0
  private static TRADE_SIZE_PERC = 0.2
  public static get() {
    return TradeSize.TRADE_SIZE
  }

  public static set(size: number) {
    TradeSize.TRADE_SIZE = size
  }

  public static setPerc(perc: number) {
    if (perc > 0 && perc <= 1) {
      TradeSize.TRADE_SIZE_PERC = perc
    }
  }

  public static getPerc() {
    return TradeSize.TRADE_SIZE_PERC
  }
}

export const getOrderPerc = async (initTradePercSize: number = 0.2) => {
  let size = 0
  try {
    const trades = await getTrades()
    let remainingPerc = 1 - initTradePercSize * (trades?.length || 0)

    if (remainingPerc <= 0) {
      throw new Error('No more balance available for trading')
    }

    size =
      initTradePercSize / remainingPerc > 1
        ? 1
        : initTradePercSize / remainingPerc
  } catch (error) {
    console.log(error)
  }
  return size
}

export const calculateOrderQuantity = async (
  tradingPair: string,
  coinTwo: string,
  expStrategy: boolean
) => {
  const minNotional = TICKERS[tradingPair]?.minNotional
  const minQty = TICKERS[tradingPair]?.minQty
  // const tradeSizeInMainCoin = parseFloat(process.env.TRADE_SIZE_MAINCOIN!)
  const tradeSizeInMainCoin = TradeSize.get()

  const precision = TICKERS[tradingPair]?.precision

  let quantity = 0

  try {
    const ticker = await binanceClient.fetchTicker(tradingPair)
    const price = ticker.average

    if (!price) {
      throw new Error('No price found')
    }

    const userWallet = await binanceClient.fetchBalance()
    const coinTwoBalance = userWallet[coinTwo].free

    if (!coinTwoBalance) {
      throw new Error('No balance available for trading')
    }

    if (expStrategy) {
      const orderPerc = await getOrderPerc()
      quantity = (coinTwoBalance * orderPerc * 0.99) / price
    } else {
      quantity = (tradeSizeInMainCoin * 0.99) / price
    }

    if (quantity < minQty) quantity = minQty

    if (price * quantity < minNotional) {
      quantity = minNotional / price
    }

    const roundStep = (qty: string, precision: number): number => {
      // Integers do not require rounding
      if (Number.isInteger(qty)) return parseFloat(qty)
      const qtyString = parseFloat(qty).toFixed(16)
      const decimalIndex = qtyString.indexOf('.')
      return parseFloat(qtyString.slice(0, decimalIndex + precision + 1))
    }

    quantity = roundStep(quantity.toString(), precision)
    return quantity
  } catch (error) {
    console.log("❗ Couldn't calculate buy quantity. ", error)
    return 0
  }
}
