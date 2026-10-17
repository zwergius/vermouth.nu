import { expect, test } from './fixtures'

test('customers navigate from Shop to a product under the shop route', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  const shopLink = page.locator('header').getByRole('link', { name: 'Shop', exact: true })
  await expect(shopLink).toHaveAttribute('href', '/shop')
  await shopLink.click()

  await expect(page).toHaveURL('/shop')
  await expect(page).toHaveTitle('Shop')
  await expect(shopLink).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('meta[property="og:url"]').last()).toHaveAttribute(
    'content',
    'https://www.vermouth.nu/shop',
  )

  await page
    .locator('main a[href="/shop/sardino-rojo?variant=sardino-rojo-75cl-bottle"]')
    .first()
    .click()

  await expect(page).toHaveURL('/shop/sardino-rojo?variant=sardino-rojo-75cl-bottle')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.vermouth.nu/shop/sardino-rojo',
  )
  await expect(page.locator('meta[property="og:url"]').last()).toHaveAttribute(
    'content',
    'https://www.vermouth.nu/shop/sardino-rojo',
  )
})

test('mobile navigation and footer link to Shop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(
    page.locator('main').getByRole('link', { name: 'SE HELE UDVALGET' }),
  ).toHaveAttribute('href', '/shop')
  await expect(
    page.locator('footer').getByRole('link', { name: 'Shop', exact: true }),
  ).toHaveAttribute('href', '/shop')
  await page.getByRole('button', { name: 'Navigations menu' }).click()
  await page.locator('header').getByRole('link', { name: 'Shop', exact: true }).click()

  await expect(page).toHaveURL('/shop')
  await expect(page).toHaveTitle('Shop')
})

test('legacy catalog URLs permanently redirect to Shop and preserve query strings', async ({
  request,
}) => {
  for (const [legacyPath, shopPath] of [
    ['/sortiment', '/shop'],
    ['/sortiment?utm_source=newsletter', '/shop?utm_source=newsletter'],
    ['/sortiment/sardino-rojo', '/shop/sardino-rojo'],
    [
      '/sortiment/sardino-rojo?variant=sardino-rojo-5l-bag-in-box&reviews_limit=4&reviews_offset=2&utm_source=email%20link',
      '/shop/sardino-rojo?variant=sardino-rojo-5l-bag-in-box&reviews_limit=4&reviews_offset=2&utm_source=email%20link',
    ],
  ]) {
    const response = await request.get(legacyPath, { maxRedirects: 0 })

    expect(response.status()).toBe(308)
    expect(response.headers().location).toBe(shopPath)
  }
})
