import { pool } from '../index'

export const getQuantity = async (table: string, ticker: string) => {
  try {
    const connection = await pool.getConnection()
    const sqlResponse = await connection.execute(
      `SELECT quantity FROM ${table} WHERE ticker = ?`,
      [ticker]
    )
    const q = parseFloat(sqlResponse[0].quantity)
    connection.release()
    return q
  } catch (err) {
    console.log(err)
  }
}
