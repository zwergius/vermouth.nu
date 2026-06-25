import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { PUBLIC_MEDUSA_PUBLISHABLE_KEY, PUBLIC_VITE_BACKEND_URL } from '$env/static/public'

export type CreateProductReviewInput = {
  rating: number
  title?: string
  content?: string
  reviewer_name?: string
  reviewer_email?: string
  metadata?: Record<string, unknown>
}

export type ProductReviewSubmissionResult = {
  productId: string
  alreadyReviewed?: boolean
  message?: string
  success?: boolean
}

const baseUrl = PUBLIC_VITE_BACKEND_URL.replace(/\/$/, '')

function getProductReviewsUrl(productId: string) {
  return `${baseUrl}/store/products/${encodeURIComponent(productId)}/reviews`
}

export const GET: RequestHandler = async ({ fetch, params, url }) => {
  const query = new URLSearchParams({
    limit: url.searchParams.get('limit') ?? '5',
    offset: url.searchParams.get('offset') ?? '0',
    order: url.searchParams.get('order') ?? '-created_at',
  })
  const fields = url.searchParams.get('fields')

  if (fields) {
    query.set('fields', fields)
  }

  const response = await fetch(`${getProductReviewsUrl(params.id)}?${query}`, {
    headers: {
      'x-publishable-api-key': PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
  })

  if (!response.ok) {
    return json(
      { message: 'Failed to fetch product reviews' },
      {
        status: response.status,
      },
    )
  }

  return json(await response.json())
}

export const POST: RequestHandler = async ({ fetch, params, request }) => {
  return fetch(getProductReviewsUrl(params.id), {
    method: 'POST',
    headers: {
      'content-type': request.headers.get('content-type') ?? 'application/json',
      'x-publishable-api-key': PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
    body: request.body,
  })
}
