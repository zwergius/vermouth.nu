import { expect, test, type Page } from '@playwright/test'

const productName = 'Forzudo Rojo'
const productPath = '/sortiment/forzudo-rojo'

async function addProductToCart(page: Page) {
  await page.goto(productPath, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'LÆG I KURV' }).click()
  await expect(page.getByRole('link', { name: /kurv 1/ })).toBeVisible()
}

async function fillCheckoutForm(page: Page) {
  await page.getByRole('textbox', { name: 'E-mailadresse' }).fill('kunde@example.com')
  await page.getByRole('textbox', { name: 'Fornavn' }).fill('Karla')
  await page.getByRole('textbox', { name: 'Efternavn' }).fill('Kunde')
  await page
    .getByRole('textbox', { name: 'Adresse', exact: true })
    .fill('Overgaden Neden Vandet 49B')
  await page.getByRole('textbox', { name: 'Postnummer' }).fill('1414')
  await page.getByRole('textbox', { name: 'By' }).fill('København')
  await page.getByRole('textbox', { name: 'Telefonnummer' }).fill('26353606')
  await page.getByRole('checkbox', { name: /Jeg accepterer handelsbetingelserne/ }).check()
}

test('customer can add and remove a product from the cart', async ({ page }) => {
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'domcontentloaded' })

  const productRow = page.locator('li').filter({ hasText: productName }).first()
  await expect(productRow).toBeVisible()
  await expect(productRow.locator('input[name="quantity"]')).toHaveValue('1')

  await productRow.getByRole('button', { name: `Fjern ${productName} fra kurv.` }).click()
  await expect(productRow).toBeHidden()
})

test('customer can update cart item quantity', async ({ page }) => {
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'domcontentloaded' })

  const productRow = page.locator('li').filter({ hasText: productName }).first()
  const quantityInput = productRow.locator('input[name="quantity"]')
  await expect(quantityInput).toHaveValue('1')

  await quantityInput.fill('2')
  await quantityInput.dispatchEvent('change')
  await expect(quantityInput).toHaveValue('2')

  await quantityInput.fill('1')
  await quantityInput.dispatchEvent('change')
  await expect(quantityInput).toHaveValue('1')
})

test('checkout form marks invalid postal codes as invalid', async ({ page }) => {
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'domcontentloaded' })

  const postalCodeInput = page.getByRole('textbox', { name: 'Postnummer' })
  await postalCodeInput.fill('abcd')

  await expect(postalCodeInput).toHaveAttribute('pattern', '\\d*')
  await expect(postalCodeInput).toHaveJSProperty('validity.valid', false)
})

test('customer can continue from cart to payment', async ({ page }) => {
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'domcontentloaded' })

  await expect(page.getByText(productName).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kontaktinformation' })).toBeVisible()

  await fillCheckoutForm(page)
  await page.getByRole('button', { name: 'Gå til betaling' }).click()

  await expect(page).toHaveURL(/payments\.epay\.eu/)
  await expect(page.getByText('Secure payment by')).toBeVisible()
})
