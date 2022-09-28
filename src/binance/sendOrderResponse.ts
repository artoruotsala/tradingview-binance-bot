import { OrderResponseFull, OrderType } from 'binance'
import { writeToDb } from '../db/writeToDb'

export const sendOrderResponse = (
  orderStatus: OrderResponseFull,
  orderType: string
) => {
  if (
    orderStatus !== undefined &&
    orderStatus.status !== undefined &&
    orderStatus.status === 'FILLED'
  ) {
    if (orderType.toUpperCase() === 'BUY')
      writeToDb(orderStatus.symbol, orderStatus.executedQty as string)

    return { status: 'Order Placed', code: 200 }
  }
  return { status: 'Order Failed', code: 400 }
}
