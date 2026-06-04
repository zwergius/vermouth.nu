import type { PageLoad } from './$types'
import { sdk } from '$lib/medusa'

export const load: PageLoad = async ({ parent }) => {
  const { cart } = await parent()

  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cart.id,
  })

  const shippingPrices = Object.fromEntries(
    shipping_options
      .filter(({ price_type }) => price_type === 'flat')
      .map(({ amount, id }) => [id, amount]),
  )

  const calculatedShippingPrices = await Promise.allSettled(
    shipping_options
      .filter(({ price_type }) => price_type !== 'flat')
      .map(({ id }) => sdk.store.fulfillment.calculate(id, { cart_id: cart.id, data: {} })),
  )

  calculatedShippingPrices.forEach((result) => {
    if (result.status !== 'fulfilled') return

    const { amount, id } = result.value.shipping_option
    shippingPrices[id] = amount
  })

  return {
    shippingOptions: shipping_options,
    shippingPrices,
  }
}
