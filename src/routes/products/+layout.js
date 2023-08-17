import { vermouths } from './data.js'
/** @type {import('./$types').LayoutLoad} */
export function load() {
  return {
    card: vermouths.map((vermouth) => ({
      name: vermouth.name,
      cardImage: vermouth.cardImage,
      brand: vermouth.brand,
    })),
  }
}
