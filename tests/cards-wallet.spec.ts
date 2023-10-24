import { test, expect } from '@playwright/test'

test('check that the buttons redirect each one to its link', async ({ page }) => {
  await page.goto('http://www.vermouth.nu/cards/christian')

  const userAgent = await page.evaluate(() => navigator.userAgent)

  if (userAgent.includes('Chrome') || userAgent.includes('Firefox')) {
    await page.waitForLoadState('domcontentloaded')
    const download1Promise = page.waitForEvent('download')
    await page.getByRole('link', { name: 'add the card to your wallet for ios' }).click()
    const download1 = await download1Promise

    expect(download1.url()).toContain('/christian.pkpass')

    await page.getByRole('link', { name: 'add the card to your wallet for android' }).click()
    await page.waitForLoadState('domcontentloaded')
    const page1Promise = page.waitForEvent('popup')
    expect(page1Promise).not.toBeNull()
  }
  if (userAgent.includes('safari')) {
    await page.getByRole('link', { name: 'add the card to your wallet for ios' }).click()

    const popupIos = await page.waitForEvent('popup')
    expect(popupIos).not.toBeNull()

    const linkSelector = `a:has-text("add the card to your wallet for Android")`
    await page.click(linkSelector)

    const [popup] = await Promise.all([page.waitForEvent('popup')])
    expect(popup).toBeTruthy()
  }
})
