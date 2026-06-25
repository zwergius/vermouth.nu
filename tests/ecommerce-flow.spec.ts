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

  const selectedShippingMethod = page
    .locator('fieldset')
    .filter({ hasText: 'Leveringsmetode' })
    .locator('label')
    .filter({ has: page.locator('input:checked') })
  const selectedShippingPrice = await selectedShippingMethod.locator('p').nth(1).innerText()
  const deliverySummaryPrice = page
    .locator('dl')
    .filter({ hasText: 'Subtotal' })
    .first()
    .locator('div')
    .filter({ hasText: 'Levering' })
    .locator('dd')

  await expect(deliverySummaryPrice).toHaveText(selectedShippingPrice)

  await productRow.getByRole('button', { name: `Fjern ${productName} fra kurv.` }).click()
  await expect(productRow).toBeHidden()
})

test('customer can apply a discount code in the cart summary', async ({ page }) => {
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'networkidle' })

  const cartSummary = page.locator('[data-testid="cart-summary"]:visible')
  const discountCodeInput = cartSummary.getByRole('textbox', { name: 'Rabatkode' })
  const applyDiscountButton = cartSummary.getByRole('button', { name: 'Anvend' })
  const totals = cartSummary.getByTestId('cart-totals')
  const totalsBoxBeforeError = await totals.boundingBox()

  await discountCodeInput.fill('not-a-code')
  await applyDiscountButton.click()

  await expect(cartSummary.getByText('Rabatkoden kunne ikke anvendes.')).toBeVisible()

  const totalsBoxAfterError = await totals.boundingBox()
  expect(totalsBoxAfterError?.y).toBe(totalsBoxBeforeError?.y)

  await discountCodeInput.fill('test10')
  await applyDiscountButton.click()

  await expect(cartSummary.getByText('Rabatkoden er tilføjet.')).toBeVisible()
  await expect(totals.locator('div').filter({ hasText: 'Rabat' })).toBeVisible()
})

test('customer can continue from cart to payment', async ({ page }) => {
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'networkidle' })

  await expect(page.getByText(productName).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kontaktinformation' })).toBeVisible()

  await fillCheckoutForm(page)
  await page.getByRole('button', { name: 'Gå til betaling' }).click()

  await expect(page).toHaveURL(/payments\.epay\.eu/, { timeout: 15_000 })
  await expect(page.getByText('Secure payment by')).toBeVisible()
})
