import express from 'express'
import mariadb from 'mariadb'
import dotenv from 'dotenv'
dotenv.config()
import { newOrderRoute, rootRoute } from './routes'
import { MainClient } from 'binance'
import { initExchangeData } from './binance/binance'

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

const app = express()
app.use(express.json())

app.use(newOrderRoute, rootRoute)

app.listen(3000, () => {
  initExchangeData(exchange)
  console.log(`Server running on port ${PORT}`)
})
