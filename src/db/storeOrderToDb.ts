import { connection } from '../index'
import { exchange } from '..'

export type SQLResponse = {
  ticker: string
  quantity: string
  buyPrice: string
  sellPrice: string
  pyramids: number
  timestamp: number
  highest: string
}

export const storeOrderToDb = async (tradingPair: string, qty: string) => {
  try {
    const avgPrice = await exchange.getAvgPrice({ symbol: tradingPair })
    const buyPrice = avgPrice.price
    const timestamp = Date.now().valueOf() / 1000 / 60

    const readTickers = async () => {
      return new Promise((resolve, reject) => {
        connection.execute(
          'SELECT * FROM `tickers` WHERE `ticker` = ?',
          [tradingPair],
          async function (err, results, fields) {
            resolve(results)
          }
        )
      })
    }

    const sqlResponse = (await readTickers()) as SQLResponse[]

    let pyramids = 0
    let newQuantity = qty
    let highest = buyPrice
    let sellPrice = '0'

    if (sqlResponse.length !== 0) {
      highest =
        parseFloat(sqlResponse[0].highest) > parseFloat(buyPrice as string)
          ? sqlResponse[0].highest
          : buyPrice
      sellPrice = sqlResponse[0].sellPrice
      pyramids = sqlResponse[0].pyramids

      const quantity = parseFloat(sqlResponse[0].quantity)
      newQuantity = (quantity + parseFloat(qty)).toString()
    }

    pyramids++

    connection.execute(
      'REPLACE INTO `tickers` (`ticker`, `quantity`, `buyPrice`, `sellPrice`, `pyramids`, `timestamp`, `highest`) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        tradingPair,
        newQuantity,
        buyPrice,
        sellPrice,
        pyramids,
        timestamp,
        highest,
      ]
    )

    console.log('Tickery data written')
  } catch (err) {
    console.log(err)
  }
}
