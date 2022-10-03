import ccxt from 'ccxt'
import { chatId, telegramBot } from '..'

export async function sendMessageToTelegram(
  orderStatus: ccxt.Order,
  action: string
) {
  const buySell = orderStatus.side === 'buy' ? '🟢' : '🔴'
  await telegramBot.sendMessage(
    chatId,
    `Order Placed: ${buySell} ${action} ${orderStatus.symbol} ${orderStatus.filled} at ${orderStatus.price}`
  )
}
