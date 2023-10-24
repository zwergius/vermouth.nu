import { test, expect } from '@playwright/test'

test('check that the buttons redirect each one to its link', async ({ page }) => {
  await page.goto(`./cards/christian`)

  const userAgent = await page.evaluate(() => navigator.userAgent)

  if (userAgent.includes('Chrome') || userAgent.includes('Firefox')) {
    const download1Promise = page.waitForEvent('download')
    await page.getByRole('link', { name: 'add the card to your wallet for ios' }).click()
    const download1 = await download1Promise

    expect(download1.url()).toContain('/christian.pkpass')

    const linkSelector = `a:has-text("add the card to your wallet for Android")`
    await page.click(linkSelector)
    await page.waitForLoadState('domcontentloaded')
    const popup = await page.waitForEvent('popup')
    expect(popup).not.toBeNull()
  }
  if (userAgent.includes('safari')) {
    await page.click('a[href="http://www.vermouth.nu/christian.pkpass"]')

    const popupIos = await page.waitForEvent('popup')
    expect(popupIos).not.toBeNull()

    const linkSelector = `a:has-text("add the card to your wallet for Android")`
    await page.click(linkSelector)

    const [popup] = await Promise.all([page.waitForEvent('popup')])
    expect(popup).toBeTruthy()
  }
})
