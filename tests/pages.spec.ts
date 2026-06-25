import { expect, test } from '@playwright/test'
import { vermouths } from '../src/lib/data/products'

const productReviews = [
  {
    id: 'review-test-4',
    rating: 4,
    title: 'God med tonic og appelsin',
    content: 'Super flot farve og god duft.',
    reviewer_name: 'Testkunde D',
    created_at: '2026-06-24T10:00:00.000Z',
  },
  {
    id: 'review-test-3',
    rating: 5,
    title: 'Klar favorit til fredag',
    content: 'Den har præcis den maritime friskhed jeg håbede på.',
    reviewer_name: 'Testkunde C',
    created_at: '2026-06-24T09:00:00.000Z',
  },
  {
    id: 'review-test-2',
    rating: 4,
    title: 'Flot balance og god bitterhed',
    content: 'Meget nem at servere direkte fra køleskabet.',
    reviewer_name: 'Testkunde B',
    created_at: '2026-06-24T08:00:00.000Z',
  },
  {
    id: 'review-test-1',
    rating: 5,
    title: 'Perfekt til en stille aperitif',
    content: 'Frisk, bitter og rund på den helt rigtige måde.',
    reviewer_name: 'Testkunde A',
    created_at: '2026-06-24T07:00:00.000Z',
  },
]

const sardinoRojoProduct = {
  id: 'prod_test_sardino_rojo',
  title: 'Sardino Rojo',
  handle: 'sardino-rojo',
  subtitle: 'Sømandens foretrukne',
  description:
    'Sardino slår sig selv op på at være en maritim vermouth, den kommer helt fra den Spanske vestkyst.',
  categories: [{ id: 'pcat_test_red', handle: 'red', name: 'Red' }],
  variants: [
    {
      id: 'variant_test_sardino_rojo',
      calculated_price: {
        calculated_amount: 195,
        original_amount: 195,
      },
    },
  ],
}

const pages = [
  { path: '/', text: 'ENDNU IKKE FAN AF VERMOUTH?' },
  { path: '/sortiment', text: 'VIL DU SMAGE FØR DU KØBER?' },
  { path: '/smagninger', text: 'Vermouth Smagning' },
  { path: '/inspiration', text: 'DRINKS OPSKRIFTER' },
  { path: '/forhandlere', text: 'FYSISKE FORHANDLERE' },
  { path: '/om-os', text: 'VENNERNE SOM' },
  { path: '/kurv', text: 'Kontaktinformation' },
  { path: '/handelsbetingelser', text: 'Handelsbetingelser' },
  { path: '/fortrolighedspolitik', text: 'Fortrolighedspolitik' },
  { path: '/betaling/fejl', text: 'Vi kunne ikke gennemføre betalingen.' },
]

test.describe('site pages', () => {
  for (const { path, text } of pages) {
    test(`${path} renders expected content`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' })

      await expect(page.locator('header img[alt="Vermouth.nu"]')).toBeVisible()
      await expect(page.locator('main')).toContainText(text)
      await expect(page.locator('footer')).toContainText('info@vermouth.nu')
    })
  }
})

test.describe('product detail pages', () => {
  for (const [handle, vermouth] of Object.entries(vermouths)) {
    test(`/sortiment/${handle} renders product details`, async ({ page }) => {
      await page.goto(`/sortiment/${handle}`, { waitUntil: 'domcontentloaded' })

      const productName = await page.locator('h1').innerText()

      await expect(page.locator('h1')).not.toBeEmpty()
      await expect(page.getByRole('img', { name: productName }).first()).toBeVisible()
      await expect(page.locator('main')).toContainText(vermouth.recommendation)
      await expect(page.getByRole('button', { name: 'LÆG I KURV' })).toBeVisible()
    })
  }

  test('product reviews load more through URL pagination', async ({ page }) => {
    const reviewRequests: Array<{ limit: string | null; offset: string | null }> = []

    await page.route('**/store/products?handle=sardino-rojo**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          products: [sardinoRojoProduct],
        }),
      })
    })

    await page.route('**/api/products/*/reviews**', async (route) => {
      const url = new URL(route.request().url())
      const limit = Number(url.searchParams.get('limit') ?? '2')
      const offset = Number(url.searchParams.get('offset') ?? '0')
      reviewRequests.push({
        limit: url.searchParams.get('limit'),
        offset: url.searchParams.get('offset'),
      })

      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          reviews: productReviews.slice(offset, offset + limit),
          average_rating: 4.5,
          review_count: productReviews.length,
          count: productReviews.length,
          limit,
          offset,
        }),
      })
    })

    await page.goto('/sortiment', { waitUntil: 'networkidle' })
    await page.locator('a[href="/sortiment/sardino-rojo"]').click()

    await expect(page).toHaveURL(/\/sortiment\/sardino-rojo$/)
    await expect(page.locator('#product-review-list > li')).toHaveCount(2)
    await expect(page.getByText('4 anmeldelser').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'VIS FLERE (2)' })).toBeVisible()
    expect(reviewRequests[0]).toEqual({ limit: '2', offset: '0' })

    await page.getByRole('button', { name: 'VIS FLERE (2)' }).click()

    await expect(page).toHaveURL(/\/sortiment\/sardino-rojo\?reviews_limit=4&reviews_offset=0$/)
    await expect(page.locator('#product-review-list > li')).toHaveCount(4)
    await expect(page.getByRole('button', { name: /VIS FLERE/ })).toBeHidden()
    expect(reviewRequests[1]).toEqual({ limit: '4', offset: '0' })
  })
})
