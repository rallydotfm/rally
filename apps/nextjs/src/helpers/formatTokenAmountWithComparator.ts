import { ScalarOperator } from '@lens-protocol/sdk-gated'

export function formatTokenAmountWithComparator(amount: string, comparator: string, text?: string) {
  const formatted = new Intl.NumberFormat().format(parseFloat(amount))
  switch (comparator) {
    case ScalarOperator.LessThan:
      return `less than ${formatted} ${text}`
      break
    case ScalarOperator.GreaterThan:
      return `more than ${formatted} ${text}`
      break
    case ScalarOperator.LessThanOrEqual:
      return `${formatted} ${text} or less`
      break
    case ScalarOperator.GreaterThanOrEqual:
      return `${formatted} ${text} or more`
      break
    case ScalarOperator.Equal:
      return `exactly ${formatted} ${text}`
      break
    case ScalarOperator.NotEqual:
      return `an amount different from ${formatted} ${text}`
      break
    default:
      break
  }
}

export default formatTokenAmountWithComparator
