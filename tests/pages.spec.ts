import { expect, test } from '@playwright/test'
import { vermouths } from '../src/lib/data/products'

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
})
