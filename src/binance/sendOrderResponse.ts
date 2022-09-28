import { OrderResponseFull, OrderType } from 'binance'
import { resetTickerAndStoreToDb } from '../db/resetTickerAndStoreToDb'
import { storeOrderToDb } from '../db/storeOrderToDb'

export const sendOrderResponse = (
  orderStatus: OrderResponseFull,
  orderType: string
) => {
  if (orderStatus && orderStatus.status && orderStatus.status === 'FILLED') {
    if (orderType.toUpperCase() === 'BUY')
      storeOrderToDb(orderStatus.symbol, orderStatus.executedQty as string)
    else
      resetTickerAndStoreToDb(
        orderStatus.symbol,
        orderStatus.executedQty as string,
        orderStatus.price as string
      )

    return { status: 'Order Placed', code: 200 }
  }
  return { status: 'Order Failed', code: 400 }
}
