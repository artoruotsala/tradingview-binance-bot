import { TICKERS, binanceClient } from './binance'
import { getTrades } from '../db/getTrades'
import { roundStep } from '../helpers/roundStep'

export class TradeSize {
  private static TRADE_SIZE = parseFloat(process.env.TRADE_SIZE_MAINCOIN!) || 0
  private static TRADE_SIZE_PERC = 0.4
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

export const getOrderPerc = async (wallet: 'spot' | 'margin') => {
  let size = 0
  const percSize = TradeSize.getPerc()

  try {
    const trades = await getTrades(wallet)

    let remainingPerc = 1 - percSize * (trades?.length || 0)

    if (remainingPerc < 0) {
      throw new Error('No more balance available for trading')
    }

    size = percSize / remainingPerc > 1 ? 1 : percSize / remainingPerc
  } catch (error) {
    console.log(error)
  }
  return size
}

export const calculateOrderQuantity = async (
  tradingPair: string,
  coinTwo: string,
  expStrategy: boolean,
  wallet: 'spot' | 'margin'
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

    const userWallet = await binanceClient.fetchBalance({ type: wallet })
    const coinTwoBalance = userWallet[coinTwo].free

    if (!coinTwoBalance) {
      throw new Error('No balance available for trading')
    }

    if (expStrategy) {
      //! spot strategy hard coded for now (100% of balance)
      if (wallet === 'spot') {
        quantity = (coinTwoBalance * 1 * 0.98) / price
      } else {
        const orderPerc = await getOrderPerc(wallet)
        quantity = (coinTwoBalance * orderPerc * 0.98) / price
      }
    } else {
      quantity = (tradeSizeInMainCoin * 0.98) / price
    }

    if (quantity < minQty) quantity = minQty

    if (price * quantity < minNotional) {
      quantity = minNotional / price
    }

    quantity = roundStep(quantity.toString(), precision)
    return quantity
  } catch (error) {
    console.log("❗ Couldn't calculate buy quantity. ", error)
    return 0
  }
}
