import { OrderResponseFull, OrderSide } from 'binance'
import { exchange } from '..'
import { calculateOrderQuantity } from './calculateOrderQuantity'
import { sendOrderResponse } from './sendOrderResponse'

export const createNewOrder = async (
  tradingPair: string,
  coinOne: string,
  coinTwo: string,
  orderType: string
) => {
  let orderStatus: OrderResponseFull
  let quantity = 0

  const failedOrder = { status: 'Order Failed', code: 400 }

  try {
    // BUY ORDER

    if (orderType.toUpperCase() === 'BUY') {
      quantity = await calculateOrderQuantity(tradingPair, coinTwo, true)
      console.log('calculating amount')
      if (!quantity) {
        console.log("quantity couldn't be calculated")
        return failedOrder
      }
    }
    // SELL ORDER
    // at this point, sell all
    else if (orderType.toUpperCase() === 'SELL') {
      const userWallet = await exchange.getAccountInformation()
      const userWalletData = userWallet.balances
      const userWalletDataFiltered = userWalletData.filter(
        (coin) => coin.asset === coinOne
      )
      quantity = parseFloat(userWalletDataFiltered[0].free as string)
      if (!quantity) {
        console.log('no quantity')
        return failedOrder
      }
    }

    orderStatus = (await exchange.submitNewOrder({
      symbol: tradingPair,
      side: orderType.toUpperCase() as OrderSide,
      type: 'MARKET',
      quantity: quantity,
    })) as OrderResponseFull
    console.log('ℹ️  Response from Binance: ', orderStatus)
    return sendOrderResponse(orderStatus, orderType)
  } catch (error) {
    console.log(`❗ Couldn't place ${orderType} order.`, error)
    return failedOrder
  }
}
