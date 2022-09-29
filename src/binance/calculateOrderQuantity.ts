import { AvgPriceResult } from 'binance-api-node'
import { global } from './binance'
import { exchange } from '../index'

export const calculateOrderQuantity = async (
  tradingPair: string,
  coinTwo: string
) => {
  const minNotional = parseFloat(
    global.minimums[tradingPair]?.minNotional || '0'
  )
  const minQty = parseInt(global.minimums[tradingPair]?.minQty || '0')
  const tradeSizeInMainCoin = parseFloat(process.env.TRADE_SIZE_MAINCOIN!)
  // const tradeSizeInMainCoin = 500
  const stepSize = global.minimums[tradingPair]?.stepSize

  let quantity = 0

  try {
    // Get average price of trading pair (5 min average)

    const avgPrice = (await exchange.getAvgPrice({
      symbol: tradingPair,
    })) as AvgPriceResult

    const price = parseFloat(avgPrice.price)

    // Get user wallet
    const userWallet = await exchange.getAccountInformation()
    let coinTwoBalance = undefined

    // Find the free balance of coinTwo
    if (userWallet.balances !== undefined && userWallet.balances.length > 0) {
      userWallet.balances.forEach((token) => {
        if (token.asset === coinTwo) {
          coinTwoBalance = token.free
        }
      })
    }

    // Calculate Quantity - Quantity = coinTwo balance / tradingPair average price;
    if (coinTwoBalance !== undefined && price !== undefined) {
      quantity = tradeSizeInMainCoin / price
    }

    // Set minimum order amount with minQty
    if (quantity < minQty) quantity = minQty

    // Set minimum order value with minNotional
    if (price * quantity < minNotional) {
      quantity = minNotional / price
    }

    // Round to stepSize
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
