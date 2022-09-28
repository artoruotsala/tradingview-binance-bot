import express from 'express'
import dotenv from 'dotenv'
import router from './routes/new-order'
dotenv.config()
import { initExchangeData } from './binance/binance'

initExchangeData()

const app = express()

const PORT = process.env.PORT || 3000

app.use(router)

app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`)
})
