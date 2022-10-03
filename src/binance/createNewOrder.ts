import { getQuantity } from '../db/getQuantity'
import { roundStep } from '../helpers/roundStep'
import {
  createMarketOrder,
  fetchBalance,
  marginBorrow,
  marginRepay,
  TICKERS,
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
        type: 'spot',
      }
    )

    console.log('ℹ️  Response from Binance: ', orderStatus)
    return finishNewOrder(orderStatus, action)
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
      return finishNewOrder(orderStatus, action)
    } else if (action === 'repay') {
      const quantity = await getQuantity(tradingPair)
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
      await marginRepay(coinTwo, quantity, Date.now())

      console.log('Repayed!')
      return finishNewOrder(orderStatus, action)
    } else {
      return failedOrder
    }
  } catch (error) {
    console.log(`❗ Couldn't place ${action} order.`, error)
    return failedOrder
  }
}
