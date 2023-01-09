import { ScalarOperator } from '@lens-protocol/sdk-gated'

export function formatTokenAmountWithComparator(amount: string, comparator: string, symbol?: string) {
  const formatted = new Intl.NumberFormat().format(parseFloat(amount))
  switch (comparator) {
    case ScalarOperator.LessThan:
      return `less than ${formatted}`
      break
    case ScalarOperator.GreaterThan:
      return `more than ${formatted}`
      break
    case ScalarOperator.LessThanOrEqual:
      return `${formatted} or less`
      break
    case ScalarOperator.GreaterThanOrEqual:
      return `${formatted} or more`
      break
    case ScalarOperator.Equal:
      return `exactly ${formatted}`
      break
    case ScalarOperator.NotEqual:
      return `an amount different from ${formatted}`
      break
    default:
      break
  }
}

export default formatTokenAmountWithComparator
