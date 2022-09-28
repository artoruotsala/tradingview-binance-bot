import { Router } from 'express'
import { createNewOrder } from '../binance/createNewOrder'

const router = Router()

router.get('/', async (req, res) => {
  res.status(200).send({ message: 'Hello World!' })
})

router.post('/new-order', async (req, res) => {
  const { tradingPair, coinOne, coinTwo, orderType, password } = req.body

  if (!tradingPair || !coinOne || !coinTwo || !orderType || !password) {
    res.status(400).send('Missing required parameters')
    return
  }

  // Send order recieved text
  // sendText(`🤖 An order to ${orderType} ${coinOne} was sent to Binance Bot.`);

  console.log(`🤖 An order to ${orderType} ${coinOne} was sent to Binance Bot.`)

  const status = await createNewOrder(tradingPair, coinOne, coinTwo, orderType)

  res.status(status.code).json(status?.status)
})

export default router
