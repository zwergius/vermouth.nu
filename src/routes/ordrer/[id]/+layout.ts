import type { LayoutLoad } from './$types'
import { sdk } from '$lib/medusa'

export const load: LayoutLoad = async ({ params }) => {
  const { order } = await sdk.store.order.retrieve(params.id)

  return {
    order,
  }
}
