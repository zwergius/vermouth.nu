import type { PageServerLoad } from './$types'
import { sdk } from '$lib/medusa'

export const load: PageServerLoad = async ({ params, locals }) => {
  const { id } = params
  const { order } = await sdk.store.order.retrieve(id)

  return {
    order,
    locale: locals.locale,
  }
}
