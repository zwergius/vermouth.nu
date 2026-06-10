import type { PageLoad } from './$types'
import { sdk } from '$lib/medusa'

const shippingTypeOrder: Record<string, number> = {
  parcel_shop: 1,
}

function sortParcelShopShippingOptionsFirst<T extends { type: { code: string } }>(
  shippingOptions: T[],
) {
  return [...shippingOptions].sort((first, second) => {
    const firstType = first.type.code
    const secondType = second.type.code

    return (shippingTypeOrder[firstType] ?? 999) - (shippingTypeOrder[secondType] ?? 999)
  })
}

export const load: PageLoad = async ({ parent }) => {
  const { cart } = await parent()

  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cart.id,
  })
  const shippingOptions = sortParcelShopShippingOptionsFirst(shipping_options)

  const shippingPrices = Object.fromEntries(
    shippingOptions
      .filter(({ price_type }) => price_type === 'flat')
      .map(({ amount, id }) => [id, amount]),
  )

  const calculatedShippingPrices = await Promise.allSettled(
    shippingOptions
      .filter(({ price_type }) => price_type !== 'flat')
      .map(({ id }) => sdk.store.fulfillment.calculate(id, { cart_id: cart.id, data: {} })),
  )

  calculatedShippingPrices.forEach((result) => {
    if (result.status !== 'fulfilled') return

    const { amount, id } = result.value.shipping_option
    shippingPrices[id] = amount
  })

  return {
    shippingOptions,
    shippingPrices,
  }
}
