import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello World!')
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

  // const status = await placeOrder(tradingPair, coinOne, coinTwo, orderType);

  res.status(200).json(status)
})

export default router
