import { vermouths } from './data.js'

export function load() {
  return {
    card: vermouths.map((vermouth) => ({
      name: vermouth.name,
      cardImage: vermouth.cardImage,
      brand: vermouth.brand,
    })),
  }
}
