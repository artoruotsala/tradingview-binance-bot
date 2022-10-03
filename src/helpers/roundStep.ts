export const roundStep = (qty: string, precision: number): number => {
  // Integers do not require rounding
  if (Number.isInteger(qty)) return parseFloat(qty)
  const qtyString = parseFloat(qty).toFixed(16)
  const decimalIndex = qtyString.indexOf('.')
  return parseFloat(qtyString.slice(0, decimalIndex + precision + 1))
}
