import { getProductListAnalyticsItem } from '$lib/helpers/analytics'
import type { EligibleProductVariant } from '$lib/helpers/product-variants'
import type { HttpTypes } from '@medusajs/types'
import { describe, expect, it } from 'vitest'

describe('product list analytics', () => {
  it('attributes a grid item to the displayed variant', () => {
    const product = {
      id: 'prod_wine',
      title: 'Wine',
    } as HttpTypes.StoreProduct
    const variant = {
      id: 'variant_box',
      sku: 'wine-5l-bag-in-box',
      title: 'Bag-in-Box',
      variant_rank: 1,
      options: [{ value: '5 L', option: { title: 'Size' } }],
      calculated_price: { calculated_amount: 800 },
    } as EligibleProductVariant

    expect(
      getProductListAnalyticsItem({
        brand: 'Winery',
        category: 'Red Vermouth',
        index: 2,
        listId: 'RED',
        listName: 'red',
        product,
        variant,
      }),
    ).toEqual({
      item_id: 'prod_wine',
      item_name: 'Wine',
      price: '800',
      item_brand: 'Winery',
      item_category: 'Red Vermouth',
      item_variant: 'Bag-in-Box — 5 L',
      item_list_name: 'red',
      item_list_id: 'RED',
      index: 2,
      quantity: '1',
    })
  })
})
