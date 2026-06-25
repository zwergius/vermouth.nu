import type { PageLoad } from './$types'
import type { CartShippingOptionsResponse } from '../api/cart/[id]/shipping-options/+server'

export const load: PageLoad = async ({ fetch, parent }) => {
  const { cart } = await parent()
  const response = await fetch(`/api/cart/${encodeURIComponent(cart.id)}/shipping-options`)

  return (await response.json()) as CartShippingOptionsResponse
}
