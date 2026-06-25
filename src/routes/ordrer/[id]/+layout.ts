import type { LayoutLoad } from './$types'
import { sdk } from '$lib/medusa'

export const load: LayoutLoad = async ({ parent, params }) => {
  const [{ order }, { locale }] = await Promise.all([sdk.store.order.retrieve(params.id), parent()])

  return {
    locale,
    order,
  }
}
