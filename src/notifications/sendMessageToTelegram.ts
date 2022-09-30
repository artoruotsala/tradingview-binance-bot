import { OrderResponseFull } from 'binance'
import { chatId, telegramBot } from '..'

export async function sendMessageToTelegram(orderStatus: OrderResponseFull) {
  const buySell = orderStatus.side === 'BUY' ? '🟢' : '🔴'
  await telegramBot.sendMessage(
    chatId,
    `Order Placed: ${buySell} ${orderStatus.symbol} ${orderStatus.executedQty} at ${orderStatus.fills[0].price}`
  )
}
