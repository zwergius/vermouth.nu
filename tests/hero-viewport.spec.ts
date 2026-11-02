import { expect, test } from './fixtures'

// Include reduced viewport heights to account for mobile browser toolbars.
for (const viewport of [
  { width: 375, height: 553 },
  { width: 390, height: 664 },
  { width: 834, height: 1054 },
  { width: 834, height: 700 },
]) {
  test(`homepage hero fits below the header at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const image = page.locator('main picture img').first()
    const artwork =
      viewport.width < 768
        ? 'eb42a8d5-286d-467c-ca6e-b726e2039b00'
        : '61953ada-c997-4ec7-5412-5e6b490ddc00'

    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toContain(artwork)
    await expect(image).toHaveCSS('object-fit', 'contain')

    const header = await page.locator('header').boundingBox()
    const hero = await image.boundingBox()
    expect(header).not.toBeNull()
    expect(hero).not.toBeNull()
    expect(hero!.y).toBeGreaterThanOrEqual(header!.y + header!.height)
    expect(hero!.y + hero!.height).toBeLessThanOrEqual(viewport.height)
  })
}

for (const width of [390, 834, 1440]) {
  test(`Inspiration has a hero and the correct introduction layout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/inspiration', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('main h1')).toHaveCount(1)
    await expect(page.locator('main h1')).toContainText('Fra kikset')
    await expect(
      page.getByRole('heading', { level: 2, name: 'INSPIRATION', exact: true }),
    ).toBeVisible()
    await expect(page.locator('main picture')).toHaveCount(1)

    const introduction = page.locator('main > section.split-content')
    await expect(introduction).toHaveCSS('flex-direction', width < 1024 ? 'column' : 'row')
    const copy = await introduction.locator('.copy').boundingBox()
    const image = await introduction.locator('img').boundingBox()
    expect(copy).not.toBeNull()
    expect(image).not.toBeNull()
    if (width < 1024) {
      expect(copy!.y + copy!.height).toBeLessThanOrEqual(image!.y)
    } else {
      expect(copy!.x + copy!.width).toBeLessThanOrEqual(image!.x)
    }
  })
}

test('the homepage hero links to the shop', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const heroLink = page.getByRole('link', { name: /Sardino Rojo – klasse vermouth til kongepris/i })
  await expect(heroLink).toHaveAttribute('href', /^\.?\/shop$/)
  await heroLink.click()
  await expect(page).toHaveURL(/\/shop$/)
})
