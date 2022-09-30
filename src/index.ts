import express, { NextFunction } from 'express'
import mariadb from 'mariadb'
import dotenv from 'dotenv'
dotenv.config()
import { newOrderRoute, rootRoute } from './routes'
import { MainClient } from 'binance'
import { initExchangeData } from './binance/binance'
import TelegramBot from 'node-telegram-bot-api'
import { setTelegramCallbacks } from './notifications/setTelegramCallbacks'

const PORT = process.env.PORT || 3000

export const pool = mariadb.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
})

export const exchange = new MainClient({
  api_key: process.env.BINANCE_API_KEY!,
  api_secret: process.env.BINANCE_API_SECRET!,
  beautifyResponses: true,
})

export const chatId = process.env.TELEGRAM_CHAT_ID_LIVE!
export const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN_LIVE!, {
  polling: true,
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

app.listen(3000, () => {
  initExchangeData(exchange)
  telegramBot.sendMessage(chatId, `Binance bot started! 🚀`)
  console.log(`Server running on port ${PORT}`)
})
