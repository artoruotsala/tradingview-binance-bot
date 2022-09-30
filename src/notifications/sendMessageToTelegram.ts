import { OrderResponseFull } from 'binance'
import { telegramBot } from './telegramBot'

export async function sendMessageToTelegram(orderStatus: OrderResponseFull) {
  const buySell = orderStatus.side === 'BUY' ? '🟢' : '🔴'
  await telegramBot.sendMessage(
    `Order Placed: ${buySell} ${orderStatus.symbol} ${orderStatus.executedQty} at ${orderStatus.fills[0].price}`
  )
}
