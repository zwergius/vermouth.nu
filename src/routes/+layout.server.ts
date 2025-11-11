import type { LayoutServerLoad } from './$types'
import { sdk } from '$lib/medusa/index'

export const load: LayoutServerLoad = async ({ params }) => {
  const data = await sdk.store.product.list({
    limit: 3,
    offset: 0,
    collection_id: 'pcol_01K9M5TBX8RNQFARPASPH3ASKM',
  })
  return {
    products: data.products,
    post: {
      title: `Title for ${params.slug} goes here`,
      content: `Content for ${params.slug} goes here`,
    },
  }
}
