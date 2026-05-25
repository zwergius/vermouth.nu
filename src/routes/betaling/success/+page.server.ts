import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import type { HttpTypes } from '@medusajs/types'

// Extend StoreCart type to include order when fetched with *order.id fields
type CartWithOrder = HttpTypes.StoreCart & {
  order?: { id: string }
}

export const load: PageServerLoad = async ({ cookies, url, parent }) => {
  const cartId = cookies.get('cart_id')
  if (!cartId) {
    redirect(303, '/betaling/fejl')
  }

  // Get cart from parent layout
  const { cart } = await parent()
  const cartWithOrder = cart as CartWithOrder

  // Check if cart is completed with order
  const isCompleted = cartWithOrder.completed_at && cartWithOrder.order?.id

  // Handle timeout from meta refresh (no-JS fallback)
  const hasTimedOut = url.searchParams.get('timeout') === 'true'

  if (isCompleted) {
    // Cart completed, redirect to order page
    redirect(303, `/orders/${cartWithOrder.order!.id}`)
  } else if (hasTimedOut) {
    redirect(303, '/betaling/fejl')
  }

  // Not completed yet, return data for client-side polling
  return {
    completed: false,
    cartId,
  }
}
