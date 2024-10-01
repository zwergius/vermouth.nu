import type { PageLoad } from './$types'
import { vermouths } from '$lib/data/products'
import { error } from '@sveltejs/kit'
const validSlugs = Object.keys(vermouths) as Array<keyof typeof vermouths>

export const load: PageLoad = ({ params }) => {
  const vermouthSlug = params.slug as keyof typeof vermouths
  if (!validSlugs.includes(vermouthSlug))
    error(404, `Vermouth med id: ${params.slug} eksisterer ikke.`)
  const vermouth = vermouths[vermouthSlug]
  const redVermouths = Object.values(vermouths).filter(({ color }) => color === 'RED')
  const whiteVermouths = Object.values(vermouths).filter(({ color }) => color === 'WHITE')
  const otherVermouths = Object.values(vermouths).filter(
    ({ color }) => color !== 'WHITE' && color !== 'RED',
  )
  return { vermouth, redVermouths, whiteVermouths, otherVermouths }
}
