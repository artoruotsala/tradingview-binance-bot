import { pool } from '..'
import { SQLResponse } from './storeOrderToDb'

export const resetTickerAndStoreToDb = async (
  tradingPair: string,
  quantity: string,
  sellPrice: string
) => {
  try {
    const connection = await pool.getConnection()
    const sqlResponse = (await connection.execute(
      'SELECT buyPrice FROM tickers WHERE ticker = ?',
      [tradingPair]
    )) as SQLResponse[]

    const buyPrice = sqlResponse[0]?.buyPrice || '0'
    const timestamp = Date.now().valueOf() / 1000 / 60

    await connection.execute(
      'REPLACE INTO tickers (ticker, quantity, buyPrice, sellPrice, pyramids, timestamp, highest) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [tradingPair, '0', '0', '0', 0, 0, '0']
    )

    await connection.execute(
      'INSERT INTO alltrades (ticker, quantity, buyPrice, sellPrice, timestamp) VALUES (?, ?, ?, ?, ?)',
      [tradingPair, quantity, buyPrice, sellPrice, timestamp]
    )

    connection.release()

    console.log('Reset ticker and stored to db')
  } catch (error) {
    console.log(error)
  }
}
