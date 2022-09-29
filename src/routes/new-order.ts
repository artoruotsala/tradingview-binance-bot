import { Router } from 'express'
import { createNewOrder } from '../binance/createNewOrder'

export const newOrderRoute = Router()

newOrderRoute.post('/new-order', async (req, res) => {
  const { tradingPair, coinOne, coinTwo, orderType, password } = req.body

  if (!tradingPair || !coinOne || !coinTwo || !orderType || !password) {
    res.status(400).send('Missing required parameters')
    return
  }

  if (password !== process.env.PASSWORD) {
    res.status(401).send('Unauthorized')
    return
  }

  console.log(`🤖 An order to ${orderType} ${coinOne} was sent to Binance Bot.`)

  const status = await createNewOrder(tradingPair, coinOne, coinTwo, orderType)

  res.status(status.code).json(status.status)
})
