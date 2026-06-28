import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import type { HttpTypes } from '@medusajs/types'
import { sdk } from '$lib/medusa'

// Extend StoreCart type to include order when fetched with *order.id fields
type CartWithOrder = HttpTypes.StoreCart & {
  order?: { id: string }
}

function cartIdFromPaymentReference(reference: string) {
  return reference.startsWith('cart_') ? reference : `cart_${reference}`
}

export const load: PageServerLoad = async ({ cookies, url }) => {
  const paymentReference = url.searchParams.get('reference')
  const cartId = paymentReference
    ? cartIdFromPaymentReference(paymentReference)
    : cookies.get('cart_id')

  if (!cartId) {
    redirect(303, '/betaling/fejl')
  }

  // Prefer the ePay transaction reference from the success URL so this route
  // can find the paid cart even if the active shopping cart cookie has already
  // been rotated by the root layout.
  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields: '+order.id',
  })
  const cartWithOrder = cart as CartWithOrder

  // Check if cart is completed with order
  const isCompleted = cartWithOrder.completed_at && cartWithOrder.order?.id

  // Handle timeout from meta refresh (no-JS fallback)
  const hasTimedOut = url.searchParams.get('timeout') === 'true'

  if (isCompleted) {
    // Cart completed, redirect to order page
    redirect(303, `/ordrer/${cartWithOrder.order!.id}`)
  } else if (hasTimedOut) {
    redirect(303, '/betaling/fejl')
  }

  // Not completed yet, return data for client-side polling
  return {
    completed: false,
    cartId,
  }
}
