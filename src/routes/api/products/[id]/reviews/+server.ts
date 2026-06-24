import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { PUBLIC_MEDUSA_PUBLISHABLE_KEY, PUBLIC_VITE_BACKEND_URL } from '$env/static/public'

export const GET: RequestHandler = async ({ fetch, params, url }) => {
  const query = new URLSearchParams({
    limit: url.searchParams.get('limit') ?? '5',
    offset: url.searchParams.get('offset') ?? '0',
    order: url.searchParams.get('order') ?? '-created_at',
  })
  const fields = url.searchParams.get('fields')
  const baseUrl = PUBLIC_VITE_BACKEND_URL.replace(/\/$/, '')

  if (fields) {
    query.set('fields', fields)
  }

  const response = await fetch(
    `${baseUrl}/store/products/${encodeURIComponent(params.id)}/reviews?${query}`,
    {
      headers: {
        'x-publishable-api-key': PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  )

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
