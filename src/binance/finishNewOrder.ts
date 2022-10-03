import { resetTickerAndStoreToDb } from '../db/resetTickerAndStoreToDb'
import { storeOrderToDb } from '../db/storeOrderToDb'
import { sendMessageToTelegram } from '../notifications/sendMessageToTelegram'
import ccxt from 'ccxt'

export const finishNewOrder = (
  orderStatus: ccxt.Order,
  action: string,
  table: 'spot' | 'marginlong' | 'marginshort'
) => {
  if (orderStatus && orderStatus.status && orderStatus.status === 'closed') {
    if (action === 'buy') {
      storeOrderToDb(
        table,
        orderStatus.info.symbol,
        orderStatus.filled.toString(),
        orderStatus.price.toString()
      )
    } else if (action === 'sell' || action === 'repay') {
      resetTickerAndStoreToDb(
        table,
        orderStatus.info.symbol,
        orderStatus.filled.toString(),
        orderStatus.price.toString()
      )
    }

    sendMessageToTelegram(orderStatus, action)
    return { status: 'Order Placed', code: 200 }
  }
  return { status: 'Order Failed', code: 400 }
}
