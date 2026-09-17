export function formatPrice(
  amount: number,
  currency: string,
  locale: string,
  currencyFirst = false,
): string {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
  }).format(amount)
  return currencyFirst
    ? `${currency.toUpperCase()} ${formatted.replace(currency.toUpperCase(), '').trim()}`
    : formatted
}
