import type { PageServerLoad } from './$types'
import { sdk } from '$lib/medusa'

export const load: PageServerLoad = async ({ params, parent, locals }) => {
  const { id } = params
  // Calling await parent() to make sure cart is renewed
  await parent()
  const { order } = await sdk.store.order.retrieve(id)

  return {
    order,
    locale: locals.locale,
  }
}
