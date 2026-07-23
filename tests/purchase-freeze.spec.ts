import { expect, test, type Page } from '@playwright/test'

declare const process: {
  env: Record<string, string | undefined>
}

const purchasesPaused = process.env.PURCHASES_PAUSED?.trim().toLowerCase() === 'true'

function postDirectly(page: Page, url: string, form: Record<string, string> = {}) {
  return page.evaluate(
    async ({ form, url }) => {
      const response = await fetch(url, {
        body: new URLSearchParams(form),
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
          'x-sveltekit-action': 'true',
        },
        method: 'POST',
      })
      const result = (await response.json()) as {
        status: number
        type: string
      }

      return {
        actionStatus: result.status,
        actionType: result.type,
        responseStatus: response.status,
      }
    },
    { form, url },
  )
}

test.describe('catalog promotion purchase freeze', () => {
  test.skip(!purchasesPaused, 'Run with PURCHASES_PAUSED=true')

  test('keeps browsing available and blocks purchase entry points', async ({ page }) => {
    await page.goto('/sortiment/forzudo-rojo', { waitUntil: 'domcontentloaded' })

    await expect(page.getByTestId('purchase-pause')).toContainText(
      'Køb er midlertidigt sat på pause',
    )
    await expect(page.getByRole('button', { name: 'KØB MIDLERTIDIGT PAUSET' })).toBeDisabled()

    const variantId = await page.locator('input[name="variant_id"]').inputValue()
    const addToCartResponse = await postDirectly(page, '/kurv?/addOrUpdateItemQuantity', {
      quantity: '1',
      variant_id: variantId,
    })
    expect(addToCartResponse).toEqual({
      actionStatus: 503,
      actionType: 'failure',
      responseStatus: 200,
    })

    await page.goto('/kurv', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('button', { name: 'BETALING MIDLERTIDIGT PAUSET' })).toBeDisabled()

    const checkoutResponse = await postDirectly(page, '/kurv?/checkout')
    expect(checkoutResponse).toEqual({
      actionStatus: 503,
      actionType: 'failure',
      responseStatus: 200,
    })

    const paymentResponse = await page.request.get('/betaling', { maxRedirects: 0 })
    expect(paymentResponse.status()).toBe(503)
  })
})
