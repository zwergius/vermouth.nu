import type { LayoutServerLoad } from './$types'
import { sdk } from '$lib/medusa'
import { HttpTypes } from '@medusajs/types'

type CategoryHandle = 'red' | 'white' | 'other'

const cookieCartKey = 'cart_id'

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  const cartId = cookies.get(cookieCartKey)
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
  const [{ id: regionId }] = regions
  let cart!: HttpTypes.StoreCart

  if (cartId) {
    const res = await sdk.store.cart.retrieve(cartId)
    // checks if cart has been completed
    if (!res.cart.completed_at) {
      cart = res.cart
    }
  }

  if (!cart) {
    const res = await sdk.store.cart.create({
      region_id: regionId,
    })
    ;({ cart } = res)
    const today = new Date()
    cookies.set(cookieCartKey, cart.id, {
      httpOnly: false,
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
