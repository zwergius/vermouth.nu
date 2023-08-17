import { error } from '@sveltejs/kit'
import { vermouths } from '../data.js'

export function load({ params }) {
  const vermouth = vermouths.find((vermouth) => vermouth.name === params.productName)

  if (!vermouth) throw error(404)

  return {
    vermouth,
  }
}
