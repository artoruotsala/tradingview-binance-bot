import { AvgPriceResult } from 'binance-api-node'
import { global } from './binance'
import { exchange } from '../index'
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
  const minNotional = parseFloat(
    global.minimums[tradingPair]?.minNotional || '0'
  )
  const minQty = parseInt(global.minimums[tradingPair]?.minQty || '0')
  // const tradeSizeInMainCoin = parseFloat(process.env.TRADE_SIZE_MAINCOIN!)
  const tradeSizeInMainCoin = TradeSize.get()
  const stepSize = global.minimums[tradingPair]?.stepSize

  let quantity = 0

  try {
    const avgPrice = (await exchange.getAvgPrice({
      symbol: tradingPair,
    })) as AvgPriceResult
    const price = parseFloat(avgPrice.price)

    const userWallet = await exchange.getAccountInformation()
    let coinTwoBalance = undefined

    if (userWallet.balances !== undefined && userWallet.balances.length > 0) {
      userWallet.balances.forEach((token) => {
        if (token.asset === coinTwo) {
          coinTwoBalance = token.free
        }
      })
    }

    if (coinTwoBalance !== undefined && price !== undefined) {
      if (expStrategy) {
        const orderPerc = await getOrderPerc()
        quantity = (parseFloat(coinTwoBalance) * orderPerc * 0.99) / price
      } else {
        quantity = (tradeSizeInMainCoin * 0.99) / price
      }
    } else {
      throw new Error('Could not get balance or price')
    }

    if (quantity < minQty) quantity = minQty

    if (price * quantity < minNotional) {
      quantity = minNotional / price
    }

    const roundStep = (qt: number, stepSize: string) => {
      const precision =
        stepSize.toString().split('.')[1]?.split('1')[0]?.length + 1 || 0
      return ((qt / parseFloat(stepSize)) * parseFloat(stepSize)).toFixed(
        precision
      )
    }

    quantity = parseFloat(roundStep(quantity, stepSize || '0'))
    return quantity
  } catch (error) {
    console.log("❗ Couldn't calculate buy quantity. ", error)
    return 0
  }
}
