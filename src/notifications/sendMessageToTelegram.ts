import { OrderResponseFull } from 'binance'
import { TelegramBot } from 'telegram-bot-nodejs'

const bot = new TelegramBot(
  process.env.TELEGRAM_TOKEN_LIVE!,
  process.env.TELEGRAM_CHAT_ID_LIVE!
)

export async function sendMessageToTelegram(orderStatus: OrderResponseFull) {
  const buySell = orderStatus.side === 'BUY' ? '🟢' : '🔴'
  await bot.sendMessage(
    `Order Placed: ${buySell} ${orderStatus.symbol} ${orderStatus.executedQty} at ${orderStatus.fills[0].price}`
  )
}
