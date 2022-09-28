import Binance from 'binance-api-node'
import { MainClient } from 'binance'

export const client = Binance({
  apiKey: process.env.API_KEY!,
  apiSecret: process.env.API_SECRET!,
})

const exchange = new MainClient({
  api_key: process.env.API_KEY!, // Get this from your account on binance.com
  api_secret: process.env.API_SECRET!, // Same for this
})

// Get exchangeInfo on startup
// minNotional = minimum order value (price * quantity)
exchange
  .getExchangeInfo()
  .then((result) => {
    console.log('getExchangeInfo inverse result: ', result)
  })
  .catch((err) => {
    console.error('getExchangeInfo inverse error: ', err)
  })

// exchange.getExchangeInfo((error, data) => {
//   if (error) console.error(error)
//   let minimums = {}
//   for (let obj of data.symbols) {
//     let filters = { status: obj.status }
//     for (let filter of obj.filters) {
//       if (filter.filterType == 'MIN_NOTIONAL') {
//         filters.minNotional = filter.minNotional
//       } else if (filter.filterType == 'PRICE_FILTER') {
//         filters.minPrice = filter.minPrice
//         filters.maxPrice = filter.maxPrice
//         filters.tickSize = filter.tickSize
//       } else if (filter.filterType == 'LOT_SIZE') {
//         filters.stepSize = filter.stepSize
//         filters.minQty = filter.minQty
//         filters.maxQty = filter.maxQty
//       }
//     }

//     filters.orderTypes = obj.orderTypes
//     filters.icebergAllowed = obj.icebergAllowed
//     minimums[obj.symbol] = filters
//   }

//   global.minimums = minimums
// })
