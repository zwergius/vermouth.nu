import type { Actions } from './$types'
import { error, fail } from '@sveltejs/kit'
import type { HttpTypes } from '@medusajs/types'
import { sdk } from '$lib/medusa'
import type { CreateProductReviewInput } from '../../../api/products/[id]/reviews/+server'

const MAX_TITLE_LENGTH = 120
const MAX_CONTENT_LENGTH = 5000
const MAX_REVIEWER_NAME_LENGTH = 120

type ReviewableOrderItem = {
  lineItemIds: string[]
  productHandle: string | null
  productId: string
}

function getString(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : ''
}

async function getOrder(orderId: string) {
  try {
    const { order } = await sdk.store.order.retrieve(orderId)
    return order
  } catch (orderError) {
    console.error('order.retrieve failed with error: ', orderError)
    error(404, 'Ordren blev ikke fundet.')
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getReviewableItems(order: HttpTypes.StoreOrder): ReviewableOrderItem[] {
  const itemsByProductId = new Map<string, ReviewableOrderItem>()

  for (const item of order.items ?? []) {
    if (!item.product_id) continue

    const existingItem = itemsByProductId.get(item.product_id)

    if (existingItem) {
      existingItem.lineItemIds.push(item.id)
      continue
    }

    itemsByProductId.set(item.product_id, {
      lineItemIds: [item.id],
      productHandle: item.product_handle,
      productId: item.product_id,
    })
  }

  return Array.from(itemsByProductId.values())
}

function getReviewPayload(
  formData: FormData,
  order: HttpTypes.StoreOrder,
  item: ReviewableOrderItem,
) {
  const rating = Number(formData.get('rating'))
  const title = getString(formData.get('title'))
  const content = getString(formData.get('content'))
  const reviewerName = getString(formData.get('reviewer_name'))
  const reviewerEmail = getString(formData.get('reviewer_email'))

  const errors: string[] = []

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push('Vælg en vurdering mellem 1 og 5.')
  }

  if (title.length > MAX_TITLE_LENGTH) {
    errors.push(`Overskriften må højst være ${MAX_TITLE_LENGTH} tegn.`)
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    errors.push(`Anmeldelsen må højst være ${MAX_CONTENT_LENGTH} tegn.`)
  }

  if (!reviewerName) {
    errors.push('Skriv dit navn.')
  } else if (reviewerName.length > MAX_REVIEWER_NAME_LENGTH) {
    errors.push(`Navnet må højst være ${MAX_REVIEWER_NAME_LENGTH} tegn.`)
  }

  if (!reviewerEmail || !isValidEmail(reviewerEmail)) {
    errors.push('Skriv en gyldig email.')
  }

  const payload: CreateProductReviewInput = {
    rating,
    metadata: {
      line_item_ids: item.lineItemIds,
      order_display_id: order.display_id,
      order_id: order.id,
      product_handle: item.productHandle,
    },
  }

  if (title) payload.title = title
  if (content) payload.content = content
  if (reviewerName) payload.reviewer_name = reviewerName
  if (reviewerEmail) payload.reviewer_email = reviewerEmail

  return {
    errors,
    payload,
    values: {
      content,
      rating: Number.isInteger(rating) ? String(rating) : '',
      reviewer_email: reviewerEmail,
      reviewer_name: reviewerName,
      title,
    },
  }
}

export const actions = {
  submitReview: async ({ fetch, params, request }) => {
    const order = await getOrder(params.id)
    const formData = await request.formData()
    const productId = getString(formData.get('product_id'))
    const lineItemId = getString(formData.get('line_item_id'))
    const reviewableItems = getReviewableItems(order)
    const item = reviewableItems.find(
      (reviewableItem) =>
        reviewableItem.productId === productId && reviewableItem.lineItemIds.includes(lineItemId),
    )

    if (!item) {
      return fail(403, {
        message: 'Produktet hører ikke til denne ordre.',
        productId,
      })
    }

    const { errors, payload, values } = getReviewPayload(formData, order, item)

    if (errors.length) {
      return fail(400, {
        message: errors[0],
        productId,
        values,
      })
    }

    const response = await fetch(`/api/products/${encodeURIComponent(productId)}/reviews`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const responseBody = await response.json().catch(() => ({}))

    if (response.status === 409) {
      return {
        alreadyReviewed: true,
        message: 'Du har allerede anmeldt dette produkt.',
        productId,
      }
    }

    if (!response.ok) {
      return fail(response.status, {
        message:
          typeof responseBody.message === 'string'
            ? responseBody.message
            : 'Anmeldelsen kunne ikke sendes.',
        productId,
        values,
      })
    }

    return {
      message: 'Tak for din anmeldelse. Den bliver synlig, når den er godkendt.',
      productId,
      success: true,
    }
  },
} satisfies Actions
