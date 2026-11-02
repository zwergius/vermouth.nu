import type { HttpTypes } from '@medusajs/types'
import { render } from 'svelte/server'
import type { ComponentProps } from 'svelte'
import { expect, it, vi } from 'vitest'
import Shop from './+page.svelte'

vi.mock('$app/paths', () => ({ resolve: (path: string) => path }))

function product(handle: string, shopOrder?: unknown, variantCount = 1) {
  const data: Partial<HttpTypes.StoreProduct> = {
    id: handle,
    handle,
    title: handle,
    metadata: { shop_order: shopOrder },
    variants: Array.from({ length: variantCount }, (_, rank) => {
      const variant: Partial<HttpTypes.StoreProductVariant> = {
        id: `${handle}-${rank}`,
        sku: `${handle}-${rank}`,
        title: 'Flaske',
        variant_rank: rank,
        calculated_price: {
          id: `price-${handle}-${rank}`,
          calculated_amount: 100,
          original_amount: 100,
          original_amount_with_tax: 100,
          original_amount_without_tax: 100,
          currency_code: 'dkk',
        },
        options: [],
      }
      return variant as HttpTypes.StoreProductVariant
    }),
  }
  return data as HttpTypes.StoreProduct
}

it('puts Sardino first in red and white, and Blandet Rød first in packages', () => {
  const mixedRed = product('mix-red', 20)
  const categories = {
    red: [product('forzudo-rojo'), mixedRed, product('sardino-rojo', 10, 2)],
    white: [product('forzudo-blanco'), product('sardino-blanco', 10)],
    other: [product('carmeleta-orange')],
    packs: [product('forzudo-combo'), mixedRed],
  }
  categories.red[2].variants!.reverse()
  const { body } = renderShop(categories)

  const cardOrder = [...body.matchAll(/href="\/shop\/([^?" ]+)\?variant=/g)].map(
    ([, handle]) => handle,
  )
  expect(cardOrder).toEqual([
    'sardino-rojo',
    'sardino-rojo',
    'mix-red',
    'forzudo-rojo',
    'sardino-blanco',
    'forzudo-blanco',
    'carmeleta-orange',
    'mix-red',
    'forzudo-combo',
  ])
  expect([...body.matchAll(/\?variant=([^"]+)/g)].slice(0, 2).map(([, sku]) => sku)).toEqual([
    'sardino-rojo-0',
    'sardino-rojo-1',
  ])
  expect(categories.red[0].handle).toBe('forzudo-rojo')
})

function renderShop(categories: ComponentProps<typeof Shop>['data']['categories']) {
  const data: Partial<ComponentProps<typeof Shop>['data']> = {
    categories,
    locale: 'da-DK',
    region: { currency_code: 'dkk' } as HttpTypes.StoreRegion,
  }
  return render(Shop, {
    props: { params: {}, data: data as ComponentProps<typeof Shop>['data'] },
  })
}

function renderProductOrder(products: HttpTypes.StoreProduct[]) {
  const { body } = renderShop({ red: products, white: [], other: [], packs: [] })
  return [...body.matchAll(/href="\/shop\/([^?" ]+)\?variant=/g)].map(([, handle]) => handle)
}

it('accepts numeric strings and zero without mutating the loaded products', () => {
  const products = [
    product('forzudo-rojo'),
    product('tabira', 20),
    product('sardino-rojo', ' 10 '),
    product('carmeleta-rosso', 0),
  ]
  const original = [...products]
  expect(renderProductOrder(products)).toEqual([
    'carmeleta-rosso',
    'sardino-rojo',
    'tabira',
    'forzudo-rojo',
  ])
  expect(products).toEqual(original)
})

it('preserves relative order for equal ranks and invalid or missing metadata', () => {
  const products = [
    product('forzudo-rojo'),
    product('forzudo-blanco', ' '),
    product('sardino-rojo', null),
    product('sardino-blanco', false),
    product('carmeleta-orange', 'first'),
    product('carmeleta-blanco', Infinity),
    product('tabira', NaN),
    product('carmeleta-rosso', {}),
    product('mix-red', 10),
    product('mix-white', '10'),
  ]
  delete products[0].metadata
  expect(renderProductOrder(products)).toEqual([
    'mix-red',
    'mix-white',
    ...products.slice(0, -2).map(({ handle }) => handle),
  ])
  expect(renderProductOrder([])).toEqual([])
})
