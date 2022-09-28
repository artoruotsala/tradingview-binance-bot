import { connection } from '..'
import { SQLResponse } from './storeOrderToDb'

export const resetTickerAndStoreToDb = async (
  tradingPair: string,
  quantity: string,
  sellPrice: string
) => {
  const readTickerPrice = async () => {
    return new Promise((resolve, reject) => {
      connection.execute(
        'SELECT buyPrice FROM `tickers` WHERE `ticker` = ?',
        [tradingPair],
        async function (err, results, fields) {
          resolve(results)
        }
      )
    })
  }

  const response = (await readTickerPrice()) as SQLResponse[]
  const buyPrice = response[0].buyPrice || '0'
  const timestamp = Date.now().valueOf() / 1000 / 60

  connection.execute(
    'REPLACE INTO `tickers` (`ticker`, `quantity`, `buyPrice`, `sellPrice`, `pyramids`, `timestamp`, `highest`) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [tradingPair, '0', '0', '0', 0, 0, '0']
  )

  connection.execute(
    'INSERT INTO `allTrades` (`ticker`, `quantity`, `buyPrice`, `sellPrice`, `timestamp`) VALUES (?, ?, ?, ?, ?)',
    [tradingPair, quantity, buyPrice, sellPrice, timestamp]
  )
}
