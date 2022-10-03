import { resetTickerAndStoreToDb } from '../db/resetTickerAndStoreToDb'
import { storeOrderToDb } from '../db/storeOrderToDb'
import { sendMessageToTelegram } from '../notifications/sendMessageToTelegram'
import ccxt from 'ccxt'

export const sendOrderResponse = (
  orderStatus: ccxt.Order,
  orderType: string
) => {
  if (orderStatus && orderStatus.status && orderStatus.status === 'closed') {
    if (orderType === 'buy') {
      storeOrderToDb(
        orderStatus.symbol,
        orderStatus.filled.toString(),
        orderStatus.price.toString()
      )
    } else if (orderType === 'sell')
      resetTickerAndStoreToDb(
        orderStatus.symbol,
        orderStatus.filled.toString(),
        orderStatus.price.toString()
      )

    sendMessageToTelegram(orderStatus)
    return { status: 'Order Placed', code: 200 }
  }
  return { status: 'Order Failed', code: 400 }
}
