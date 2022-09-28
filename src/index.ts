import express from 'express'
import dotenv from 'dotenv'
import router from './routes/new-order'
import { MainClient } from 'binance'
dotenv.config()
import { initExchangeData } from './binance/binance'

export const exchange = new MainClient({
  api_key: process.env.API_KEY!, // Get this from your account on binance.com
  api_secret: process.env.API_SECRET!, // Same for this
})

initExchangeData(exchange)

const app = express()

const PORT = process.env.PORT || 3000

app.use(router)

app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`)
})
