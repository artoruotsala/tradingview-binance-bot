import { MainClient } from 'binance'

type Filters = {
  status: string
  minNotional?: string
  minPrice?: string
  maxPrice?: string
  tickSize?: string
  stepSize?: string
  minQty?: string
  maxQty?: string
  orderTypes?: string[]
  icebergAllowed?: boolean
}

type Globals = {
  ticker: {
    [key: string]: string
  }
  balance: {
    [key: string]: string
  }
  minimums: {
    [key: string]: Filters
  }
}

export const global: Globals = {
  ticker: {},
  balance: {},
  minimums: {},
}

export const initExchangeData = (exchange: MainClient) => {
  exchange
    .getExchangeInfo()
    .then((result) => {
      let minimums: { [key: string]: Filters } = {}
      for (let obj of result.symbols) {
        let filters: Filters = { status: obj.status }
        for (let filter of obj.filters) {
          if (filter.filterType == 'MIN_NOTIONAL') {
            filters.minNotional = filter.minNotional as string
          } else if (filter.filterType == 'PRICE_FILTER') {
            filters.minPrice = filter.minPrice as string
            filters.maxPrice = filter.maxPrice as string
            filters.tickSize = filter.tickSize as string
          } else if (filter.filterType == 'LOT_SIZE') {
            filters.stepSize = filter.stepSize as string
            filters.minQty = filter.minQty as string
            filters.maxQty = filter.maxQty as string
          }
        }

        filters.orderTypes = obj.orderTypes
        filters.icebergAllowed = obj.icebergAllowed
        minimums[obj.symbol] = filters
      }
      global.minimums = minimums
    })
    .catch((err) => {
      console.error('getExchangeInfo inverse error: ', err)
    })
}
