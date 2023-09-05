import { error } from '@sveltejs/kit'
import { vermouths } from '../data.js'
export const prerender = true

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const vermouth = vermouths.find(
    (vermouth) => vermouth.name.toLowerCase().replace(' ', '-') === params.productName,
  )

  if (!vermouth) throw error(404)

  return {
    vermouth,
  }
}
