import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './+server'

const { listRegions, listProducts } = vi.hoisted(() => ({
  listRegions: vi.fn(),
  listProducts: vi.fn(),
}))

vi.mock('$lib/medusa', () => ({
  sdk: { store: { region: { list: listRegions }, product: { list: listProducts } } },
}))

const event = {} as Parameters<typeof GET>[0]
const bottle = {
  id: 'variant_original_bottle',
  sku: 'forzudo-rojo-100cl-bottle',
  ean: ' 0123456789012 ',
  title: 'Flaske',
  options: [{ value: '100 cl', option: { title: 'Size' } }],
  variant_rank: 0,
  inventory_quantity: 20,
  calculated_price: {
    calculated_amount: 295,
    currency_code: 'dkk',
    is_calculated_price_tax_inclusive: true,
  },
  prices: [
    { currency_code: 'dkk', amount: 295, rules_count: 0 },
    { currency_code: 'dkk', amount: 250, min_quantity: 6, rules_count: 0 },
    { currency_code: 'dkk', amount: 273, min_quantity: 3, max_quantity: 5, rules_count: 0 },
  ],
}

const product = {
  id: 'prod_original',
  handle: 'forzudo-rojo',
  title: 'Vermouth & friends',
  description: 'Serve <cold>.',
  variants: [bottle],
}

describe('Google Shopping XML feed', () => {
  beforeEach(() => {
    listRegions.mockReset().mockResolvedValue({
      regions: [
        { id: 'region_eu', currency_code: 'eur', countries: [{ iso_2: 'de' }] },
        { id: 'region_dk', currency_code: 'dkk', countries: [{ iso_2: 'dk' }] },
      ],
    })
    listProducts.mockReset()
  })

  it('keeps Medusa IDs and sends the cheapest tier as a sale against the single-unit price', async () => {
    const box = {
      ...bottle,
      id: 'variant_original_box',
      sku: 'forzudo-rojo-3l-bag-in-box',
      ean: ' ',
      title: 'Bag-in-Box',
      options: [{ value: '3 L', option: { title: 'Size' } }],
      variant_rank: 1,
      inventory_quantity: 0,
      calculated_price: { ...bottle.calculated_price, calculated_amount: 800 },
      prices: [],
    }
    listProducts.mockResolvedValue({
      count: 1,
      products: [{ ...product, variants: [bottle, box] }],
    })

    const response = await GET(event)
    const xml = await response.text()
    const items = xml.match(/<item>.*?<\/item>/g)

    expect(listProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        region_id: 'region_dk',
        fields: expect.stringContaining('+variants.inventory_quantity'),
      }),
    )
    expect(response.headers.get('content-type')).toBe('application/xml; charset=utf-8')
    expect(xml).toContain('xmlns:g="http://base.google.com/ns/1.0"')
    expect(items).toHaveLength(2)
    expect(items?.[0]).toContain('<g:id>variant_original_bottle</g:id>')
    expect(items?.[0]).toContain('<g:gtin>0123456789012</g:gtin>')
    expect(items?.[0]).toContain('<g:item_group_id>prod_original</g:item_group_id>')
    expect(items?.[0]).toContain('<g:item_group_title>Vermouth &amp; friends</g:item_group_title>')
    expect(items?.[0]).toContain('<g:size>100 cl</g:size>')
    expect(items?.[0]).toContain(
      '<g:variant_option><g:name>size</g:name><g:value>100 cl</g:value></g:variant_option>',
    )
    expect(items?.[0]).toContain(
      '<g:variant_option><g:name>packaging</g:name><g:value>Flaske</g:value></g:variant_option>',
    )
    expect(items?.[0]).toContain('<g:price>295.00 DKK</g:price>')
    expect(items?.[0]).toContain('<g:sale_price>250.00 DKK</g:sale_price>')
    expect(items?.[0]).toContain('<g:availability>in_stock</g:availability>')
    expect(items?.[0]).toContain('<g:title>Vermouth &amp; friends — Flaske, 100 cl</g:title>')
    expect(items?.[0]).toContain('<g:description>Serve &lt;cold&gt;.</g:description>')
    expect(items?.[0]).toContain(
      'https://www.vermouth.nu/shop/forzudo-rojo?variant=forzudo-rojo-100cl-bottle',
    )
    expect(items?.[1]).toContain('<g:id>variant_original_box</g:id>')
    expect(items?.[1]).toContain('<g:item_group_id>prod_original</g:item_group_id>')
    expect(items?.[1]).toContain('<g:item_group_title>Vermouth &amp; friends</g:item_group_title>')
    expect(items?.[1]).toContain('<g:size>3 L</g:size>')
    expect(items?.[1]).toContain(
      '<g:variant_option><g:name>size</g:name><g:value>3 L</g:value></g:variant_option>',
    )
    expect(items?.[1]).toContain(
      '<g:variant_option><g:name>packaging</g:name><g:value>Bag-in-Box</g:value></g:variant_option>',
    )
    expect(items?.[1]).not.toContain('<g:gtin>')
    expect(items?.[1]).toContain('<g:price>800.00 DKK</g:price>')
    expect(items?.[1]).not.toContain('<g:sale_price>')
    expect(items?.[1]).toContain('<g:availability>out_of_stock</g:availability>')
  })

  it('keeps a cheaper active sale and skips unsupported tiers while paging through the catalog', async () => {
    const sale = {
      ...bottle,
      calculated_price: {
        ...bottle.calculated_price,
        calculated_amount: 225,
        is_calculated_price_price_list: true,
        calculated_price: { price_list_type: 'sale' },
      },
    }
    const second = {
      ...bottle,
      id: 'variant_unsupported_tier',
      sku: 'forzudo-blanco-bottle',
      prices: [{ currency_code: 'dkk', amount: 199, min_quantity: 3, rules_count: 1 }],
    }
    listProducts
      .mockResolvedValueOnce({ count: 2, products: [{ ...product, variants: [sale] }] })
      .mockResolvedValueOnce({
        count: 2,
        products: [{ ...product, id: 'prod_second', handle: 'forzudo-blanco', variants: [second] }],
      })

    const xml = await (await GET(event)).text()

    expect(listProducts.mock.calls.map(([query]) => query.offset)).toEqual([0, 1])
    expect(xml).toContain('<g:price>225.00 DKK</g:price>')
    expect(xml).toContain('<g:id>variant_unsupported_tier</g:id>')
    expect(xml).toContain('<g:price>295.00 DKK</g:price>')
    expect(xml).not.toContain('<g:sale_price>')
  })

  it('sends the Medusa original and price-list sale prices for a bundle', async () => {
    const bundle = {
      ...bottle,
      id: 'variant_bundle',
      sku: 'sardino-combo-2x75cl-pack',
      title: 'Pakke',
      ean: null,
      calculated_price: {
        ...bottle.calculated_price,
        original_amount: 358,
        calculated_amount: 298,
        is_calculated_price_price_list: true,
        calculated_price: { price_list_type: 'sale' },
      },
      prices: [{ currency_code: 'dkk', amount: 279, min_quantity: 3, rules_count: 0 }],
    }
    listProducts.mockResolvedValue({
      count: 1,
      products: [{ ...product, handle: 'sardino-combo', variants: [bundle] }],
    })

    const xml = await (await GET(event)).text()

    expect(xml).toContain('<g:price>358.00 DKK</g:price>')
    expect(xml).toContain('<g:sale_price>298.00 DKK</g:sale_price>')
    expect(xml).not.toContain('<g:item_group_id>')
    expect(xml).not.toContain('<g:variant_option>')
  })

  it('returns a service error when the Danish pricing region is unavailable', async () => {
    listRegions.mockResolvedValue({ regions: [] })

    await expect(GET(event)).rejects.toMatchObject({ status: 503 })
    expect(listProducts).not.toHaveBeenCalled()
  })
})
