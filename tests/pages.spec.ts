import { vermouths } from '../src/lib/data/products'
import { expect, test } from './fixtures'

const cancellationRequestActionData =
  // SvelteKit serializes ActionResult data with devalue before use:enhance deserializes it.
  '[{"action":1,"message":2,"submittedAt":3,"success":4,"values":5},"cancellationRequest","Din fortrydelse er modtaget.","2026-06-28T07:25:00.000Z",true,{"customerName":6,"email":7,"message":8,"orderReference":9},"Karla Kunde","kunde@example.com","Jeg vil fortryde købet.","1001"]'

function getActionResultResponse() {
  return JSON.stringify({
    type: 'success',
    status: 200,
    data: cancellationRequestActionData,
  })
}

async function mockCancellationRequestAction(page: import('@playwright/test').Page) {
  await page.route('**/ordrer/fortryd?**', async (route) => {
    const request = route.request()

    if (
      request.method() !== 'POST' ||
      request.headers()['x-sveltekit-action'] !== 'true' ||
      !request.url().includes('/submit')
    ) {
      await route.continue()
      return
    }

    await route.fulfill({
      body: getActionResultResponse(),
      contentType: 'application/json',
      status: 200,
    })
  })
}

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
      sku: 'sardino-rojo-75cl-bottle',
      title: 'Flaske',
      variant_rank: 0,
      options: [{ value: '75 cl', option: { title: 'Size' } }],
      calculated_price: {
        calculated_amount: 195,
        original_amount: 195,
      },
    },
    {
      id: 'variant_test_sardino_rojo_box',
      sku: 'sardino-rojo-5l-bag-in-box',
      title: 'Bag-in-Box',
      variant_rank: 1,
      options: [{ value: '5 L', option: { title: 'Size' } }],
      calculated_price: {
        calculated_amount: 800,
        original_amount: 800,
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
  { path: '/ordrer/fortryd', text: 'Fortryd køb' },
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

test.describe('cancellation request flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockCancellationRequestAction(page)
  })

  test('customer can submit a cancellation request from the footer dialog', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' })

    await page.locator('footer').getByRole('link', { name: 'Fortryd køb her' }).click()

    const dialog = page.getByRole('dialog', { name: 'Fortryd køb' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('textbox', { name: 'Navn' }).fill('Karla Kunde')
    await dialog.getByRole('textbox', { name: 'E-mailadresse' }).fill('kunde@example.com')
    await dialog.getByRole('textbox', { name: 'Ordrenummer' }).fill('1001')
    await dialog.getByRole('textbox', { name: 'Besked' }).fill('Jeg vil fortryde købet.')
    await dialog.getByRole('button', { name: 'Bekræft fortrydelse' }).click()

    await expect(dialog.getByTestId('cancellation-request-success')).toContainText(
      'Din fortrydelse er modtaget.',
    )
  })

  test('customer can submit a cancellation request from the fallback page', async ({ page }) => {
    await page.goto('/ordrer/fortryd?email=kunde@example.com&orderReference=1001', {
      waitUntil: 'domcontentloaded',
    })

    await expect(page.getByRole('heading', { name: 'Fortryd køb' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'E-mailadresse' })).toHaveValue(
      'kunde@example.com',
    )
    await expect(page.getByRole('textbox', { name: 'Ordrenummer' })).toHaveValue('1001')

    await page.getByRole('textbox', { name: 'Navn' }).fill('Karla Kunde')
    await page.getByRole('button', { name: 'Bekræft fortrydelse' }).click()

    await expect(page.getByTestId('cancellation-request-success')).toContainText(
      'Din fortrydelse er modtaget.',
    )
  })
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

  test('normalizes the default SKU and switches all selected-variant context', async ({ page }) => {
    await page.route('**/store/products?handle=sardino-rojo**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          products: [sardinoRojoProduct],
        }),
      })
    })
    await page.route('**/api/products/*/reviews**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          reviews: [],
          average_rating: 0,
          review_count: 0,
          count: 0,
          limit: 2,
          offset: 0,
        }),
      })
    })

    await page.goto('/sortiment/sardino-rojo?variant=legacy-variant-id', {
      waitUntil: 'domcontentloaded',
    })

    await expect(page).toHaveURL(/\/sortiment\/sardino-rojo\?variant=sardino-rojo-75cl-bottle$/)
    await expect(page.locator('link[rel="canonical"]').first()).toHaveAttribute(
      'href',
      'https://www.vermouth.nu/sortiment/sardino-rojo',
    )
    const selector = page.getByRole('group', { name: 'Vælg format' })
    await expect(selector.getByText('Flaske · 75 cl')).toBeVisible()
    await expect(page.locator('input[name="variant_id"]')).toHaveValue('variant_test_sardino_rojo')

    const bibVariant = page.getByRole('radio', { name: /Bag-in-Box · 5 L/ })
    await bibVariant.scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollBy(0, -100))
    const scrollPosition = await page.evaluate(() => window.scrollY)
    expect(scrollPosition).toBeGreaterThan(0)

    await bibVariant.check()

    await expect(page).toHaveURL(/\/sortiment\/sardino-rojo\?variant=sardino-rojo-5l-bag-in-box$/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollPosition)
    await expect(page.locator('input[name="variant_id"]')).toHaveValue(
      'variant_test_sardino_rojo_box',
    )
    await expect(page.getByRole('img', { name: 'Sardino Rojo – Bag-in-Box, 5 L' })).toBeVisible()
    const productCopy = page.locator('section.split-content > .copy')
    await expect(
      productCopy.getByText('Galicien, Nordvestkysten Spanien / 15%', { exact: true }),
    ).toBeVisible()
    await expect(
      productCopy.locator(':scope > p').filter({ hasText: /^Bag-in-Box · 5 L$/ }),
    ).toBeVisible()
    await expect(page.locator('main')).toContainText(/DKK\s*800[.,]00/)

    await page.getByRole('link', { name: 'KØB ELLER SMAG HER' }).click()
    await expect(page).toHaveURL(/\/forhandlere$/)
    await page.goBack()

    await expect(page).toHaveURL(/\/sortiment\/sardino-rojo\?variant=sardino-rojo-5l-bag-in-box$/)
    await expect(page.locator('input[name="variant_id"]')).toHaveValue(
      'variant_test_sardino_rojo_box',
    )
    await expect(page.getByRole('radio', { name: /Bag-in-Box · 5 L/ })).toBeChecked()

    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('radio', { name: /Bag-in-Box · 5 L/ })).toBeChecked()
  })

  test('shows packaging and Size without a selector for one eligible variant', async ({ page }) => {
    await page.route('**/store/products?handle=sardino-rojo**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          products: [{ ...sardinoRojoProduct, variants: [sardinoRojoProduct.variants[0]] }],
        }),
      })
    })
    await page.route('**/api/products/*/reviews**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          reviews: [],
          average_rating: 0,
          review_count: 0,
          count: 0,
          limit: 2,
          offset: 0,
        }),
      })
    })

    await page.goto('/sortiment/sardino-rojo', { waitUntil: 'domcontentloaded' })

    await expect(page).toHaveURL(/\/sortiment\/sardino-rojo\?variant=sardino-rojo-75cl-bottle$/)
    await expect(page.getByText('Flaske · 75 cl', { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('group', { name: 'Vælg format' })).toHaveCount(0)
  })

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
    await page.locator('a[href^="/sortiment/sardino-rojo?variant="]').click()

    await expect(page).toHaveURL(/\/sortiment\/sardino-rojo\?variant=sardino-rojo-75cl-bottle$/)
    await expect(page.locator('#product-review-list > li')).toHaveCount(2)
    await expect(page.getByText('4 anmeldelser').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'VIS FLERE (2)' })).toBeVisible()
    expect(reviewRequests[0]).toEqual({ limit: '2', offset: '0' })

    await page.getByRole('button', { name: 'VIS FLERE (2)' }).click()

    await expect(page).toHaveURL(
      /\/sortiment\/sardino-rojo\?variant=sardino-rojo-75cl-bottle&reviews_limit=4&reviews_offset=0$/,
    )
    await expect(page.locator('#product-review-list > li')).toHaveCount(4)
    await expect(page.getByRole('button', { name: /VIS FLERE/ })).toBeHidden()
    expect(reviewRequests[1]).toEqual({ limit: '4', offset: '0' })
  })
})
