export function toMillion(count: number): string | number {
  const tempCount = count / 10000
  return Number.isInteger(tempCount) ? tempCount : tempCount.toFixed(1)
}
