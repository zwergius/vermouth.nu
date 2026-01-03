import type { PageLoad } from './$types'
import { sdk } from '$lib/medusa/index'

export const load: PageLoad = async () => {
  const data = await sdk.store.product.list({
    limit: 3,
    offset: 0,
    collection_id: 'pcol_01K9M5TBX8RNQFARPASPH3ASKM',
  })
  return {
    products: data.products,
  }
}
