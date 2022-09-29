import express from 'express'
import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
import { newOrderRoute, rootRoute } from './routes'
import { MainClient } from 'binance'
import { initExchangeData } from './binance/binance'

const PORT = process.env.PORT || 3000

export const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'tradingview-binance-db',
})

export const exchange = new MainClient({
  api_key: process.env.API_KEY!,
  api_secret: process.env.API_SECRET!,
  beautifyResponses: true,
})

const app = express()
app.use(express.json())

app.use(newOrderRoute, rootRoute)

app.listen(3000, () => {
  initExchangeData(exchange)
  connection.connect()
  console.log(`Server running on port ${PORT}`)
})
