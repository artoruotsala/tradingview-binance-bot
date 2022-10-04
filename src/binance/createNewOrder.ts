import { getQuantity } from '../db/getQuantity'
import {
  createMarketOrder,
  fetchBalance,
  marginBorrow,
  marginRepay,
} from './binance'
import { calculateOrderQuantity } from './calculateOrderQuantity'
import { finishNewOrder } from './finishNewOrder'

export const createNewOrder = async (
  tradingPair: string,
  coinOne: string,
  coinTwo: string,
  action: 'buy' | 'sell',
  wallet: 'spot' | 'margin'
) => {
  let quantity = 0

  const failedOrder = { status: 'Order Failed', code: 400 }

  try {
    // BUY ORDER

    if (action === 'buy') {
      quantity = await calculateOrderQuantity(
        tradingPair,
        coinTwo,
        true,
        wallet
      )
      console.log('calculating amount')
      if (!quantity) {
        console.log("quantity couldn't be calculated")
        return failedOrder
      }
    }
    // SELL ORDER
    // at this point, sell all
    else if (action === 'sell') {
      const userWallet = await fetchBalance(wallet)
      quantity = userWallet[coinOne].free

      if (!quantity) {
        console.log('no quantity')
        return failedOrder
      }
    }

    const orderStatus = await createMarketOrder(
      tradingPair,
      action,
      quantity,
      undefined,
      {
        type: wallet,
      }
    )

    console.log('ℹ️  Response from Binance: ', orderStatus)
    return finishNewOrder(
      orderStatus,
      action,
      wallet === 'spot' ? 'spot' : 'marginlong'
    )
  } catch (error) {
    console.log(`❗ Couldn't place ${action} order.`, error)
    return failedOrder
  }
}

// sell flat => borrow
// buy flat => repay

export const createNewShortOrder = async (
  action: 'borrow' | 'repay',
  tradingPair: string,
  coinOne: string,
  coinTwo: string
) => {
  const failedOrder = { status: 'Order Failed', code: 400 }

  try {
    if (action === 'borrow') {
      const quantity = await calculateOrderQuantity(
        tradingPair,
        coinTwo,
        true,
        'margin'
      )
      console.log('calculating amount')
      if (!quantity) {
        console.log("quantity couldn't be calculated")
        return failedOrder
      }
      await marginBorrow(coinOne, quantity, Date.now())

      console.log('Borrowed...')
      await sleep(5000)

      const orderStatus = await createMarketOrder(
        tradingPair,
        'sell',
        quantity,
        undefined,
        {
          type: 'margin',
        }
      )

      console.log('ℹ️  Response from Binance: ', orderStatus)
      return finishNewOrder(orderStatus, action, 'marginshort')
    } else if (action === 'repay') {
      const quantity = await getQuantity('marginshort', tradingPair)
      console.log(quantity)
      if (!quantity) {
        console.log('no quantity')
        return failedOrder
      }
      const orderStatus = await createMarketOrder(
        tradingPair,
        'buy',
        quantity,
        undefined,
        {
          type: 'margin',
        }
      )
      console.log('ℹ️  Response from Binance: ', orderStatus)

      await sleep(5000)

      await marginRepay(coinOne, quantity, Date.now())
      console.log('Repayed!')
      return finishNewOrder(orderStatus, action, 'marginshort')
    } else {
      return failedOrder
    }
  } catch (error) {
    console.log(`❗ Couldn't place ${action} order.`, error)
    return failedOrder
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
