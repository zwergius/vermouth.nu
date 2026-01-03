import type { LayoutServerLoad } from './$types'
import { sdk } from '$lib/medusa'
import { HttpTypes } from '@medusajs/types'

type CategoryHandle = 'red' | 'white' | 'other'

export const load: LayoutServerLoad = async ({ locals }) => {
  const { product_categories } = await sdk.store.category.list({
    fields: '*products',
  })
  const categories = product_categories.reduce(
    (dict, category) => {
      dict[category.handle as CategoryHandle] = category.products ?? []
      return dict
    },
    {} as Record<CategoryHandle, HttpTypes.StoreProduct[]>,
  )

  const { regions } = await sdk.store.region.list()
  return {
    categories,
    region: regions[0],
    locale: locals.locale,
  }
}
