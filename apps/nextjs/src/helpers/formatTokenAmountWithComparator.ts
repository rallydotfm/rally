export function formatTokenAmountWithComparator(amount: string, comparator: string, text?: string) {
  const formatted = new Intl.NumberFormat().format(parseFloat(amount))
  switch (comparator) {
    case 'LESS_THAN':
      return `less than ${formatted} ${text}`
      break
    case 'GREATER_THAN':
      return `more than ${formatted} ${text}`
      break
    case 'LESS_THAN_OR_EQUAL':
      return `${formatted} ${text} or less`
      break
    case 'GREATER_THAN_OR_EQUAL':
      return `${formatted} ${text} or more`
      break
    case 'EQUAL':
      return `exactly ${formatted} ${text}`
      break
    case 'NOT_EQUAL':
      return `an amount different from ${formatted} ${text}`
      break
    default:
      break
  }
}

export default formatTokenAmountWithComparator
