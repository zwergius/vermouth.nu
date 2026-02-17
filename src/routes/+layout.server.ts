import { PUBLIC_VITE_BACKEND_URL } from '$env/static/public'
import type { LayoutServerLoad } from './$types'
import { HttpTypes } from '@medusajs/types'

type CategoryHandle = 'red' | 'white' | 'other'

const cookieCartKey = 'cart_id'

export const load: LayoutServerLoad = async ({ cookies, fetch, locals }) => {
  const resRegions = await fetch(`${PUBLIC_VITE_BACKEND_URL}/store/regions`)
  console.log({ resRegions })
  const { regions } = (await resRegions.json()) as HttpTypes.StoreRegionListResponse

  const res = await fetch('/store/product-categories?fields=*products')
  console.log({ res })
  const { product_categories } = (await res.json()) as HttpTypes.StoreProductCategoryListResponse

  // const productCategoriesPromise: Promise<HttpTypes.StoreProductCategoryListResponse> = fetch(
  //   '/store/product-categories?fields=*products',
  // ).then((res) => {
  //   console.info({ res })
  //   if (!res.ok) {
  //     throw new Error('ProductCategories Network response was not ok')
  //   }
  //   return res.json() // No type assertion here, we'll handle types after
  // })

  // const regionsPromise: Promise<HttpTypes.StoreRegionListResponse> = fetch('/store/regions').then(
  //   (res) => {
  //     console.info({ res })
  //     if (!res.ok) {
  //       throw new Error('Regions Network response was not ok')
  //     }
  //     return res.json() // No type assertion here, we'll handle types after
  //   },
  // )

  // const [{ product_categories }, { regions }] = await Promise.all([
  //   productCategoriesPromise,
  //   regionsPromise,
  // ])
  console.info({ product_categories, regions })

  const categories = product_categories.reduce(
    (dict, category) => {
      dict[category.handle as CategoryHandle] = category.products ?? []
      return dict
    },
    {} as Record<CategoryHandle, HttpTypes.StoreProduct[]>,
  )

  const cartId = cookies.get(cookieCartKey)
  let cart: HttpTypes.StoreCart

  if (cartId) {
    const data = await fetch(`/store/carts/${cartId}`).then((res) => {
      if (!res.ok) {
        throw new Error('Retrive Cart Network response was not ok')
      }
      return res.json() as Promise<HttpTypes.StoreCartResponse>
    })
    // TODO: complete cart an re-initiate
    ;({ cart } = data)
  } else {
    const data = await fetch(`/store/carts`, {
      method: 'POST',
      body: JSON.stringify({ region_id: regions[0].id }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Create Cart Network response was not ok')
      }
      return res.json() as Promise<HttpTypes.StoreCartResponse>
    })
    ;({ cart } = data)

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
