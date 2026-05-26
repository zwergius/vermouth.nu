// import type { PageLoad } from './$types'
// import { sdk } from '$lib/medusa/index'
// import { HttpTypes } from '@medusajs/types'
//
// type CategoryHandle = 'red' | 'white' | 'other'
//
// export const load: PageLoad = async () => {
//   const data = await sdk.store.category.list({
//     fields: '*products',
//   })
//
//   const categories = data.product_categories.reduce(
//     (dict, category) => {
//       dict[category.handle as CategoryHandle] = category.products ?? []
//       return dict
//     },
//     {} as Record<CategoryHandle, HttpTypes.StoreProduct[]>,
//   )
//
//   return {
//     categories,
//   }
// }
