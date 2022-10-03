import ccxt from 'ccxt'
import { chatId, telegramBot } from '..'

export async function sendMessageToTelegram(orderStatus: ccxt.Order) {
  const buySell = orderStatus.side === 'buy' ? '🟢' : '🔴'
  await telegramBot.sendMessage(
    chatId,
    `Order Placed: ${buySell} ${orderStatus.symbol} ${orderStatus.filled} at ${orderStatus.price}`
  )
}
