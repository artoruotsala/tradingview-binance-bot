import { Router } from 'express'
// import { createNewOrder } from '../binance/createNewOrder'

export const newOrderRoute = Router()

interface RequestBody {
  tradingPair: string
  orderType: string
  coinOne: string
  coinTwo: string
  password: string
}

let tickerArrayBuy: string[] = []
let tickerArraySell: string[] = []

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

  const { tradingPair, coinOne, coinTwo, orderType, password } =
    req.body as RequestBody

  if (!tradingPair || !coinOne || !coinTwo || !orderType || !password) {
    res.status(400).send('Missing required parameters')
    return
  }

  if (password !== process.env.TRADINGVIEW_PASSWORD!) {
    res.status(401).send('Unauthorized')
    return
  }

  //! THIS IS A TEMPORARY FIX
  // disable double buys & sells (some tradingview issues with few strategies)
  // for now it's not possible to buy many times the same coin

  if (
    tickerArrayBuy.includes(tradingPair) &&
    orderType.toUpperCase() === 'BUY'
  ) {
    res.status(400).send('Already bought this coin')
    return
  }

  if (
    tickerArraySell.includes(tradingPair) &&
    orderType.toUpperCase() === 'SELL'
  ) {
    res.status(400).send('Already sold this coin')
    return
  }
  if (orderType.toUpperCase() === 'BUY') {
    tickerArrayBuy.push(tradingPair)
    tickerArraySell = tickerArraySell.filter((item) => item !== tradingPair)
  } else {
    tickerArraySell.push(tradingPair)
    tickerArrayBuy = tickerArrayBuy.filter((item) => item !== tradingPair)
  }

  console.log(`🤖 An order to ${orderType} ${coinOne} was sent to Binance Bot.`)

  // const status = await createNewOrder(tradingPair, coinOne, coinTwo, orderType)

  // res.status(status.code).json(status.status)
  res.send(200)
})
