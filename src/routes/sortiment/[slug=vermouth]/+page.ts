import type { PageLoad } from './$types'
import { vermouths } from '$lib/data/products'
import { error } from '@sveltejs/kit'
import { sdk } from '$lib/medusa'

type ProductReview = {
  id: string
  rating: number
  title?: string | null
  content?: string | null
  reviewer_name?: string | null
  created_at: string
}

type ProductReviewsResponse = {
  reviews: ProductReview[]
  average_rating: number
  review_count: number
  count: number
  limit: number
  offset: number
}

const emptyProductReviews: ProductReviewsResponse = {
  reviews: [],
  average_rating: 0,
  review_count: 0,
  count: 0,
  limit: 0,
  offset: 0,
}

const REVIEWS_PAGE_SIZE = 2
const MAX_REVIEWS_LIMIT = 20
const validSlugs = Object.keys(vermouths) as Array<keyof typeof vermouths>

function getReviewPaginationParams(url: URL) {
  const requestedLimit = Number(url.searchParams.get('reviews_limit'))
  const requestedOffset = Number(url.searchParams.get('reviews_offset'))

  return {
    limit:
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, MAX_REVIEWS_LIMIT)
        : REVIEWS_PAGE_SIZE,
    offset: Number.isInteger(requestedOffset) && requestedOffset > 0 ? requestedOffset : 0,
  }
}

async function getProductReviews(
  productId: string,
  fetcher: typeof fetch,
  pagination: ReturnType<typeof getReviewPaginationParams>,
) {
  const params = new URLSearchParams({
    limit: String(pagination.limit),
    offset: String(pagination.offset),
    order: '-created_at',
  })
  const response = await fetcher(`/api/products/${encodeURIComponent(productId)}/reviews?${params}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product reviews')
  }

  return response.json() as Promise<ProductReviewsResponse>
}

export const load: PageLoad = async ({ fetch, params, parent, url }) => {
  const vermouthSlug = params.slug as keyof typeof vermouths
  if (!validSlugs.includes(vermouthSlug))
    error(404, `Vermouth med id: ${params.slug} eksisterer ikke.`)

  const reviewPagination = getReviewPaginationParams(url)
  const { region } = await parent()
  const data = await sdk.store.product.list({
    handle: params.slug,
    fields: '*categories,*variants.calculated_price',
    region_id: region.id,
  })

  const vermouth = vermouths[vermouthSlug]
  const product = data.products[0]
  const reviews = product?.id
    ? await getProductReviews(product.id, fetch, reviewPagination).catch((reviewsError) => {
        console.error('product reviews fetch failed with error: ', reviewsError)
        return emptyProductReviews
      })
    : emptyProductReviews

  return {
    product,
    reviews,
    vermouth,
  }
}
