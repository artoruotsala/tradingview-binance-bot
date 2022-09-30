import TelegramBot from 'node-telegram-bot-api'
import { chatId } from '..'
import { TradeSize } from '../binance/calculateOrderQuantity'
import { BotStatus } from '../routes'

export const setTelegramCallbacks = (telegramBot: TelegramBot) => {
  telegramBot.onText(/\/set (.+)/, (msg, match) => {
    const resp = match?.[1]

    if (resp && parseInt(resp) > 0) {
      TradeSize.set(parseInt(resp))
      telegramBot.sendMessage(chatId, `Trade size set to ${resp}`)
    }
  })

  telegramBot.onText(/\/status/, (msg, match) => {
    telegramBot.sendMessage(
      chatId,
      `Up and running! Trade size is ${TradeSize.get()}.`
    )
  })

  telegramBot.onText(/\/stop/, (msg, match) => {
    BotStatus.set(false)
    telegramBot.sendMessage(chatId, `Bot stopped. Not taking orders.`)
  })

  telegramBot.onText(/\/start/, (msg, match) => {
    BotStatus.set(true)
    telegramBot.sendMessage(chatId, `Bot started. Taking orders.`)
  })
}
