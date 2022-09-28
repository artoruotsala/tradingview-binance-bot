import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { newOrderRoute, rootRoute } from './routes'
import { MainClient } from 'binance'
import { initExchangeData } from './binance/binance'

const PORT = process.env.PORT || 3000

export const exchange = new MainClient({
  api_key: process.env.API_KEY!, // Get this from your account on binance.com
  api_secret: process.env.API_SECRET!, // Same for this
})

initExchangeData(exchange)

const app = express()
app.use(express.json())

app.use(newOrderRoute, rootRoute)

app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`)
})
