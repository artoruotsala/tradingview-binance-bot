import ccxt from 'ccxt'
import { createSpotOrder, fetchBalance } from './binance'
import { calculateOrderQuantity } from './calculateOrderQuantity'
import { sendOrderResponse } from './sendOrderResponse'

export const createNewOrder = async (
  tradingPair: string,
  coinOne: string,
  coinTwo: string,
  action: 'buy' | 'sell'
) => {
  let quantity = 0

  const failedOrder = { status: 'Order Failed', code: 400 }

  try {
    // BUY ORDER

    if (action === 'buy') {
      quantity = await calculateOrderQuantity(tradingPair, coinTwo, true)
      console.log('calculating amount')
      if (!quantity) {
        console.log("quantity couldn't be calculated")
        return failedOrder
      }
    }
    // SELL ORDER
    // at this point, sell all
    else if (action === 'sell') {
      const userWallet = await fetchBalance()
      const quantity = userWallet[coinOne].free
      if (!quantity) {
        console.log('no quantity')
        return failedOrder
      }
    }

    const orderStatus = await createSpotOrder(
      tradingPair,
      'market',
      action,
      quantity
    )

    console.log('ℹ️  Response from Binance: ', orderStatus)
    return sendOrderResponse(orderStatus, action)
  } catch (error) {
    console.log(`❗ Couldn't place ${action} order.`, error)
    return failedOrder
  }
}

// const createNewMarginOrder = async (orderType: 'BORROW' | 'REPAY' | 'BUY') => {

//   exchange.marginAccountBorrow({
//     asset: 'USDT',
//     amount: 100,
//   })

//   exchange.marginAccountNewOrder({
//     symbol: 'BTCUSDT',
//     side: 'SELL',
//     type: 'MARKET',
//     quantity: 0.001,

//   })

//   exchange.marginAccountRepay({
//     asset: 'USDT',
//     amount: 100,
//   })
// }
