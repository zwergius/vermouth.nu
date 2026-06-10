import type { LayoutServerLoad } from './$types'
import { sdk } from '$lib/medusa'
import { HttpTypes } from '@medusajs/types'

type CategoryHandle = 'red' | 'white' | 'other' | 'packs'

const cookieCartKey = 'cart_id'

function isCategoryHandle(handle: string): handle is CategoryHandle {
  return handle === 'red' || handle === 'white' || handle === 'other' || handle === 'packs'
}

export const load: LayoutServerLoad = async ({ cookies, depends, locals }) => {
  const cartId = cookies.get(cookieCartKey)
  let cart!: HttpTypes.StoreCart

  const { regions } = await sdk.store.region.list()
  const [{ id: regionId }] = regions

  const { products } = await sdk.store.product.list({
    fields: '*categories,*variants.calculated_price',
    region_id: regionId,
  })

  const categories = products.reduce(
    (dict, product) => {
      for (const category of product.categories ?? []) {
        if (isCategoryHandle(category.handle)) {
          dict[category.handle].push(product)
        }
      }

      return dict
    },
    {
      red: [],
      white: [],
      other: [],
      packs: [],
    } as Record<CategoryHandle, HttpTypes.StoreProduct[]>,
  )

  depends('refresh:cart')

  if (cartId) {
    try {
      const res = await sdk.store.cart.retrieve(cartId)
      // checks if cart has been completed
      if (!res.cart.completed_at) {
        cart = res.cart
      }
    } catch (e) {
      console.error('cart.retrieve failed with error: ', e)
    }
  }

  if (!cart) {
    const res = await sdk.store.cart.create({
      region_id: regionId,
    })
    ;({ cart } = res)
    const today = new Date()
    cookies.set(cookieCartKey, cart.id, {
      expires: new Date(today.setMonth(today.getMonth() + 1)),
      path: '/',
    })
  }

  return {
    cart,
    categories,
    locale: locals.locale,
    region: regions[0],
  }
}
