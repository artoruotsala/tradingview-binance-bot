import { pool } from '..'
import { SQLResponse } from './storeOrderToDb'

export const resetTickerAndStoreToDb = async (
  tradingPair: string,
  quantity: string,
  sellPrice: string
) => {
  const connection = await pool.getConnection()
  const sqlResponse = (await connection.execute(
    'SELECT buyPrice FROM tickers WHERE ticker = ?',
    [tradingPair]
  )) as SQLResponse[]

  const buyPrice = sqlResponse[0].buyPrice || '0'
  const timestamp = Date.now().valueOf() / 1000 / 60

  connection.execute(
    'REPLACE INTO tickers (ticker, quantity, buyPrice, sellPrice, pyramids, timestamp, highest) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [tradingPair, '0', '0', '0', 0, 0, '0']
  )

  connection.execute(
    'INSERT INTO alltrades (ticker, quantity, buyPrice, sellPrice, timestamp) VALUES (?, ?, ?, ?, ?)',
    [tradingPair, quantity, buyPrice, sellPrice, timestamp]
  )
}
