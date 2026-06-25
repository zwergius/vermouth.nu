import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { sdk } from '$lib/medusa'

export type CartShippingOptionsResponse = {
  shippingOptions: Awaited<
    ReturnType<typeof sdk.store.fulfillment.listCartOptions>
  >['shipping_options']
  shippingPrices: Record<string, number>
}

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

export const GET: RequestHandler = async ({ params }) => {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: params.id,
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
      .map(({ id }) => sdk.store.fulfillment.calculate(id, { cart_id: params.id, data: {} })),
  )

  calculatedShippingPrices.forEach((result) => {
    if (result.status !== 'fulfilled') return

    const { amount, id } = result.value.shipping_option
    shippingPrices[id] = amount
  })

  return json({
    shippingOptions,
    shippingPrices,
  } satisfies CartShippingOptionsResponse)
}
