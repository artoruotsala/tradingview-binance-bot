import express, { NextFunction } from 'express'
import mariadb from 'mariadb'
import dotenv from 'dotenv'
dotenv.config()
import { newOrderRoute, rootRoute } from './routes'
import { binanceClient, initExchangeData } from './binance/binance'
import TelegramBot from 'node-telegram-bot-api'
import { setTelegramCallbacks } from './notifications/setTelegramCallbacks'
import { calculateOrderQuantity } from './binance/calculateOrderQuantity'

const PORT = process.env.PORT || 3000

export const pool = mariadb.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
})

export const chatId = process.env.TELEGRAM_CHAT_ID_LIVE!
export const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN_LIVE!, {
  // polling: true,
})

const app = express()
app.use(
  express.json({
    limit: '2mb',
  })
)
app.use(function (error: any, req: any, res: any, next: NextFunction) {
  if (error) {
    res.status(400).send('Invalid JSON')
  } else {
    next()
  }
})

app.use(newOrderRoute, rootRoute)

setTelegramCallbacks(telegramBot)

app.listen(3000, async () => {
  // binanceClient.setSandboxMode(true)

  try {
    await initExchangeData()
    telegramBot.sendMessage(chatId, `Binance bot started! 🚀`)
    console.log(`Server running on port ${PORT}`)
  } catch (error) {
    console.log(error)
  }
})
