import { Router } from 'express'
import { calculateOrderQuantity } from '../binance/calculateOrderQuantity'
import { createNewOrder, createNewShortOrder } from '../binance/createNewOrder'

export const newOrderRoute = Router()

interface RequestBody {
  tradingPair: string
  action: 'buy' | 'sell'
  type: 'flat' | 'short' | 'long'
  coinOne: string
  coinTwo: string
  password: string
}

export class BotStatus {
  public static isRunning = true

  public static get() {
    return BotStatus.isRunning
  }

  public static set(status: boolean) {
    BotStatus.isRunning = status
  }
}

newOrderRoute.post('/new-order', async (req, res) => {
  if (!BotStatus.get()) {
    return res.status(400).json({
      message: 'Bot is not taking new orders',
    })
  }

  const { coinOne, coinTwo, action, password, type } = req.body as RequestBody

  if (!coinOne || !coinTwo || !action || !password || !type) {
    res.status(400).send('Missing required parameters')
    return
  }

  const tradingPair = `${coinOne}${coinTwo}`

  if (password !== process.env.TRADINGVIEW_PASSWORD!) {
    res.status(401).send('Unauthorized')
    return
  }

  const lAction = action.toLowerCase()
  let status = { status: 'Order Failed', code: 400 }
  console.log(`🤖 An order to ${lAction} ${coinOne} was sent to Binance Bot.`)

  if (type === 'flat' || type === 'short') {
    const action = lAction === 'sell' ? 'borrow' : 'repay'
    status = await createNewShortOrder(action, tradingPair, coinOne, coinTwo)
  } else {
    status = await createNewOrder(tradingPair, coinOne, coinTwo, action, 'spot')
  }

  res.status(status.code).json(status.status)
})
