import { pool } from '../index'

export type SQLResponse = {
  ticker: string
  quantity: string
  buyPrice: string
  sellPrice: string
  pyramids: number
  timestamp: number
  highest: string
}

export const storeOrderToDb = async (
  tradingPair: string,
  qty: string,
  buyPrice: string
) => {
  try {
    const timestamp = Date.now().valueOf() / 1000 / 60

    const connection = await pool.getConnection()
    const sqlResponse = await connection.execute(
      'SELECT * FROM tickers WHERE ticker = ?',
      [tradingPair]
    )

    let pyramids = 0
    let newQuantity = qty
    let highest = buyPrice
    let sellPrice = '0'

    if (sqlResponse.length !== 0) {
      highest =
        parseFloat(sqlResponse[0]?.highest) > parseFloat(buyPrice as string)
          ? sqlResponse[0]?.highest
          : buyPrice
      sellPrice = sqlResponse[0]?.sellPrice
      pyramids = sqlResponse[0]?.pyramids

      const quantity = parseFloat(sqlResponse[0]?.quantity) || 0
      newQuantity = (quantity + parseFloat(qty)).toString()
    }

    pyramids++

    await connection.execute(
      'REPLACE INTO tickers (ticker, quantity, buyPrice, sellPrice, pyramids, timestamp, highest) VALUES (?, ?, ?, ?, ?, ?, ?)',
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

    connection.release()

    console.log('Tickery data written')
  } catch (err) {
    console.log(err)
  }
}
