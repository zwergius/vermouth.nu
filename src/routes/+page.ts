import type { PageLoad } from './$types'
import { sdk } from '$lib/medusa/index'
import { dev } from '$app/environment'

export const load: PageLoad = async ({ parent }) => {
  const { region } = await parent()
  const data = await sdk.store.product.list({
    limit: 3,
    offset: 0,
    collection_id: dev ? 'pcol_01K9M5TBX8RNQFARPASPH3ASKM' : 'pcol_01KNKSM0FQXSFMJ4VE3KJMF43S',
    fields: '*variants.calculated_price',
    region_id: region.id,
  })
  return {
    products: data.products,
  }
}
