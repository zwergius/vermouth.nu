import { test, expect } from '@playwright/test'

test('check that the buttons redirect each one to its link', async ({ page }) => {
  const userAgent = await page.evaluate(() => navigator.userAgent)

  if (userAgent.includes('Chrome') || userAgent.includes('Firefox')) {
    await page.goto('./cards/christian')
    await page.waitForLoadState('domcontentloaded')
    const download1Promise = page.waitForEvent('download')
    await page.getByRole('link', { name: 'add the card to your wallet for ios' }).click()
    const download1 = await download1Promise

    expect(download1.url()).toContain('/christian.pkpass')

    const page1Promise = page.waitForEvent('popup')
    await page.getByRole('link', { name: 'add the card to your wallet for android' }).click()
    const page1 = await page1Promise

    expect(page1).not.toBeNull()
  }
  if (userAgent.includes('safari')) {
    await page.goto('./cards/christian')
    await page.getByRole('link', { name: 'add the card to your wallet for ios' }).click()

    const popupIos = await page.waitForEvent('popup')
    expect(popupIos).not.toBeNull()

    const linkSelector = `a:has-text("add the card to your wallet for Android")`
    await page.click(linkSelector)

    const [popup] = await Promise.all([page.waitForEvent('popup')])
    expect(popup).toBeTruthy()
  }
})
