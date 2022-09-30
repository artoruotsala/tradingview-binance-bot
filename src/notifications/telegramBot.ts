import { TelegramBot } from 'telegram-bot-nodejs'

export const telegramBot = new TelegramBot(
  process.env.TELEGRAM_TOKEN_LIVE!,
  process.env.TELEGRAM_CHAT_ID_LIVE!
)
