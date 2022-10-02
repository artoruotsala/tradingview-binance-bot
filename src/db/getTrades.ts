import { pool } from '../index'

export const getTrades = async () => {
  try {
    const connection = await pool.getConnection()
    const sqlResponse = await connection.execute(
      'SELECT * FROM tickers WHERE quantity > 0'
    )
    connection.release()
    return sqlResponse
  } catch (err) {
    console.log(err)
  }
}
