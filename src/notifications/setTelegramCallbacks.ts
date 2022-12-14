import TelegramBot from 'node-telegram-bot-api'
import { chatId } from '..'
import { TradeSize } from '../binance/calculateOrderQuantity'
import { getTrades } from '../db/getTrades'
import { BotStatus } from '../routes'

export const setTelegramCallbacks = (telegramBot: TelegramBot) => {
  telegramBot.onText(/\/set (.+)/, (msg, match) => {
    const resp = match?.[1]

    if (resp && parseInt(resp) > 0) {
      TradeSize.set(parseInt(resp))
      telegramBot.sendMessage(chatId, `Trade size set to ${resp}`)
    }
  })

  // telegramBot.onText(/\/setperc (.+)/, async (msg, match) => {
  //   const resp = match?.[1]
  //   let tradeLength = 0

  //   try {
  //     tradeLength = (await getTrades())?.length
  //   } catch (error) {
  //     console.log(error)
  //   }

  //   if (tradeLength > 0) {
  //     telegramBot.sendMessage(
  //       chatId,
  //       'Cant update percentage while one trade is active'
  //     )
  //     return
  //   }

  //   if (resp && parseInt(resp) > 0 && parseInt(resp) <= 100) {
  //     TradeSize.setPerc(parseInt(resp) / 100)
  //     telegramBot.sendMessage(chatId, `Trade perc size set to ${resp}`)
  //   }
  // })

  telegramBot.onText(/\/status/, (msg, match) => {
    telegramBot.sendMessage(
      chatId,
      `Up and running! Trade size is ${TradeSize.get()} / ${TradeSize.getPerc()}.`
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
