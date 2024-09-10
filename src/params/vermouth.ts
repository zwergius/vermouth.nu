import { vermouths } from '$lib/data/products'
const validSlugs = Object.keys(vermouths)

export const match = (param: string) => {
  return validSlugs.includes(param)
}
