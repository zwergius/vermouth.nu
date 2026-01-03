import type { PageLoad } from './$types'
import { vermouths } from '$lib/data/products'
import { error } from '@sveltejs/kit'
import { sdk } from '$lib/medusa'
const validSlugs = Object.keys(vermouths) as Array<keyof typeof vermouths>

export const load: PageLoad = async ({ params, parent }) => {
  const vermouthSlug = params.slug as keyof typeof vermouths
  if (!validSlugs.includes(vermouthSlug))
    error(404, `Vermouth med id: ${params.slug} eksisterer ikke.`)

  const { region } = await parent()
  const data = await sdk.store.product.list({
    handle: params.slug,
    fields: '*variants.calculated_price',
    region_id: region.id,
  })

  const vermouth = vermouths[vermouthSlug]
  const redVermouths = Object.values(vermouths).filter(({ color }) => color === 'RED')
  const whiteVermouths = Object.values(vermouths).filter(({ color }) => color === 'WHITE')
  const otherVermouths = Object.values(vermouths).filter(
    ({ color }) => color !== 'WHITE' && color !== 'RED',
  )
  return {
    product: data.products[0],
    vermouth,
    redVermouths,
    whiteVermouths,
    otherVermouths,
  }
}
