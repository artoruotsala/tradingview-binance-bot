import { OrderResponseFull, OrderType } from 'binance'
import { deleteFromDb } from '../db/deleteFromDb'
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
    else deleteFromDb(orderStatus.symbol)

    return { status: 'Order Placed', code: 200 }
  }
  return { status: 'Order Failed', code: 400 }
}
