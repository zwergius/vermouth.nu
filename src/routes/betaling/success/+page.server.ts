import type { PageServerLoad } from './$types'
import { sdk } from '$lib/medusa'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ cookies, parent }) => {
  const cartId = cookies.get('cart_id')
  if (!cartId) {
    throw redirect(303, '/betaling/fejl')
  }

  const { cart } = await parent()

  if (cart.completed_at) {
    return { completed: true }
  }

  const poll = async () => {
    const delays = [200, 400, 600, 800, 1000]
    for (const delay of delays) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cartId)
      if (updatedCart.completed_at) {
        return { completed: true }
      }
    }
    throw redirect(303, '/betaling/fejl')
  }

  return {
    completed: poll(),
  }
}
