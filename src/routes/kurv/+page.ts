import type { PageLoad } from './$types'
import { sdk } from '$lib/medusa'

export const load: PageLoad = async ({ parent }) => {
  const { cart } = await parent()

  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cart.id,
  })

  return {
    shippingOptions: shipping_options,
  }
}
