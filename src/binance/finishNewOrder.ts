import { resetTickerAndStoreToDb } from '../db/resetTickerAndStoreToDb'
import { storeOrderToDb } from '../db/storeOrderToDb'
import { sendMessageToTelegram } from '../notifications/sendMessageToTelegram'
import ccxt from 'ccxt'

export const finishNewOrder = (orderStatus: ccxt.Order, action: string) => {
  if (orderStatus && orderStatus.status && orderStatus.status === 'closed') {
    if (action === 'buy' || action === 'borrow') {
      storeOrderToDb(
        orderStatus.symbol,
        orderStatus.filled.toString(),
        orderStatus.price.toString()
      )
    } else if (action === 'sell' || action === 'repay')
      resetTickerAndStoreToDb(
        orderStatus.symbol,
        orderStatus.filled.toString(),
        orderStatus.price.toString()
      )

    sendMessageToTelegram(orderStatus, action)
    return { status: 'Order Placed', code: 200 }
  }
  return { status: 'Order Failed', code: 400 }
}
