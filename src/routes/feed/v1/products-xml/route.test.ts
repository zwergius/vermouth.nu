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

  it('keeps Medusa IDs and uses the lowest eligible unit amount for each variant', async () => {
    const box = {
      ...bottle,
      id: 'variant_original_box',
      sku: 'forzudo-rojo-3l-bag-in-box',
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
    expect(items?.[0]).toContain('<g:item_group_id>prod_original</g:item_group_id>')
    expect(items?.[0]).toContain('<g:price>250.00 DKK</g:price>')
    expect(items?.[0]).toContain('<g:availability>in_stock</g:availability>')
    expect(items?.[0]).toContain('<g:title>Vermouth &amp; friends</g:title>')
    expect(items?.[0]).toContain('<g:description>Serve &lt;cold&gt;.</g:description>')
    expect(items?.[0]).toContain(
      'https://www.vermouth.nu/shop/forzudo-rojo?variant=forzudo-rojo-100cl-bottle',
    )
    expect(items?.[1]).toContain('<g:id>variant_original_box</g:id>')
    expect(items?.[1]).toContain('<g:price>800.00 DKK</g:price>')
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
    expect(xml).not.toContain('199.00')
  })

  it('returns a service error when the Danish pricing region is unavailable', async () => {
    listRegions.mockResolvedValue({ regions: [] })

    await expect(GET(event)).rejects.toMatchObject({ status: 503 })
    expect(listProducts).not.toHaveBeenCalled()
  })
})
