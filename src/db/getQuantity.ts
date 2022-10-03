import { pool } from '../index'

export const getQuantity = async (ticker: string) => {
  try {
    const connection = await pool.getConnection()
    const sqlResponse = await connection.execute(
      'SELECT quantity FROM tickers WHERE ticker = ?',
      [ticker]
    )
    const q = parseFloat(sqlResponse[0].quantity)
    connection.release()
    return q
  } catch (err) {
    console.log(err)
  }
}
