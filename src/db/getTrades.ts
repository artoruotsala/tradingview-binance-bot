import { pool } from '../index'

export const getTrades = async (table: 'spot' | 'margin') => {
  if (table === 'spot') {
    try {
      const connection = await pool.getConnection()
      const sqlResponse = await connection.execute(
        `SELECT * FROM ${table} WHERE quantity > 0`
      )
      connection.release()
      return sqlResponse
    } catch (err) {
      console.log(err)
    }
  } else if (table === 'margin') {
    try {
      const connection = await pool.getConnection()
      const sqlResponse = await connection.execute(
        `SELECT * FROM marginlong UNION SELECT * FROM marginshort WHERE quantity > 0`
      )
      connection.release()
      return sqlResponse
    } catch (err) {
      console.log(err)
    }
  }
}
