import { OrderResponseFull } from 'binance'

export const sendOrderResponse = (orderStatus: OrderResponseFull) => {
  if (
    orderStatus !== undefined &&
    orderStatus.status !== undefined &&
    orderStatus.status === 'FILLED'
  ) {
    // sendText(
    //   `✅ A ${orderType} order of ${quantity} ${coinOne} was successfully filled.`
    // );
    // console.log(
    //   `✅ A ${orderType} order of ${quantity} ${coinOne} was successfully filled.`
    // );
    // if (orderType === "buy" || orderType === "BUY") {
    //   try {
    //     const write = await writeTickerQtyData(tradingPair, quantity);
    //   } catch (err) { console.log (err)};

    // } else if (orderType === "sell" || orderType === "SELL") {
    //   try {

    //     const deleteData = await deleteTickerQtyData(tradingPair, quantity);
    //   } catch (err) { console.log (err)};

    // }
    return { status: 'Order Placed', code: 200 }
  }
  return { status: 'Order Failed', code: 400 }
}
