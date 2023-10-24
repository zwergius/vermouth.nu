import { test, expect } from '@playwright/test'

test('check that the buttons redirect each one to its link', async ({ page }) => {
  await page.goto(`./cards/christian`)

  const userAgent = await page.evaluate(() => navigator.userAgent)

  if (userAgent.includes('Chrome') || userAgent.includes('Firefox')) {
    const download1Promise = page.waitForEvent('download')
    await page.getByRole('link', { name: 'add the card to your wallet for ios' }).click()
    const download1 = await download1Promise

    expect(download1.url()).toContain('/christian.pkpass')

    await page.click(
      'a[href="https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJidXNpbmVzcy1jYXJkc0BidXNpbmVzcy1jYXJkcy0zOTk2MDkuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJnb29nbGUiLCJvcmlnaW5zIjpbInd3dy5leGFtcGxlLmNvbSJdLCJ0eXAiOiJzYXZldG93YWxsZXQiLCJwYXlsb2FkIjp7ImdlbmVyaWNDbGFzc2VzIjpbeyJpZCI6IjMzODgwMDAwMDAwMjIyNjgwMjAuY2hyaXN0aWFuLXZlcm1vdXRoMSJ9XSwiZ2VuZXJpY09iamVjdHMiOlt7ImlkIjoiMzM4ODAwMDAwMDAyMjI2ODAyMC5jaHJpc3RpYW4tdmVybW91dGgiLCJjbGFzc0lkIjoiMzM4ODAwMDAwMDAyMjI2ODAyMC5jaHJpc3RpYW4tdmVybW91dGgxIiwic3RhdGUiOiJBQ1RJVkUiLCJsb2dvIjp7InNvdXJjZVVyaSI6eyJ1cmkiOiJodHRwczovL2ltYWdlZGVsaXZlcnkubmV0L3JPVGM5dEtDVFFCYzl6dGtpQlRYX3cvZjczMDE2MGItYTc5ZC00ZGYzLTcwNmEtNjY3YTEwOWRhNTAwL3B1YmxpYyJ9LCJjb250ZW50RGVzY3JpcHRpb24iOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IkxPR09fSU1BR0VfREVTQ1JJUFRJT04ifX19LCJjYXJkVGl0bGUiOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IlZlcm1vdXRoLm51In19LCJoZWFkZXIiOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IkNocmlzdGlhbiBad2VyZ2l1cyJ9fSwidGV4dE1vZHVsZXNEYXRhIjpbeyJpZCI6InRlbDoiLCJoZWFkZXIiOiJUZWw6IiwiYm9keSI6IiszNCA2MjIgNzYzIDcwMyJ9LHsiaWQiOiJtYWlsOiIsImhlYWRlciI6Ik1haWw6IiwiYm9keSI6ImNocmlzdGlhbkB2ZXJtb3V0aC5udSJ9LHsiaWQiOiJjdnIiLCJoZWFkZXIiOiJDVlI6IiwiYm9keSI6IjQwNjQ5Mzk1In0seyJpZCI6ImFkZHJlc3MiLCJoZWFkZXIiOiJBZGRyZXNzIiwiYm9keSI6ImMvbyBUaG9tYXMgVmFzZSBCb2xzZXRoIFxuT3ZlcmdhZGVuIE5lZGVuIFZhbmRldCA0OSBCLCBzdCAudHYgXG4xNDE0IEvDuGJlbmhhdm4gSyJ9XSwiaGV4QmFja2dyb3VuZENvbG9yIjoiI2YwYWFhOSIsImJhcmNvZGUiOnsidHlwZSI6IlFSX0NPREUiLCJ2YWx1ZSI6Imh0dHBzOi8vd3d3LnZlcm1vdXRoLm51L2NhcmRzL2NocmlzdGlhbiIsImFsdGVybmF0ZVRleHQiOiJTaGFyZSJ9LCJoZXJvSW1hZ2UiOnsic291cmNlVXJpIjp7InVyaSI6Imh0dHBzOi8vaW1hZ2VkZWxpdmVyeS5uZXQvck9UYzl0S0NUUUJjOXp0a2lCVFhfdy85MDRhYzEyNC1kZDAxLTQ0NWEtMzI2ZC0xYTEzZTM2MjUyMDAvcHVibGljIn0sImNvbnRlbnREZXNjcmlwdGlvbiI6eyJkZWZhdWx0VmFsdWUiOnsibGFuZ3VhZ2UiOiJkYS1ESyIsInZhbHVlIjoiSEVST19JTUFHRV9ERVNDUklQVElPTiJ9fX19XX0sImlhdCI6MTY5NjI1MjU3MX0.nsYiFsbIVQcGR7Frrpdcrx5qi4kqKCaB_85yCWBfjvCrJAKmmUpc5We1YJYEvOv-m6lzxmDmzgM2igzhHi3giqIN5mIdi5iWrfxF8WL-yYWuZYzPiFVqH-obM6FmACJBJAsyzoh9PEKGK3SD_WrcJBtwDXpcnFQrQUX4H47VCm4l-o-I6FPHBcJYS5-wcTpkurXJHvnjzvbDpwD8pDjAl5f1R8BR_jyNHBCmQjpwPFk9XAPi-ktgNtjvrpwN8EMxe1l-tTedQX-BaV5CRtFD_pQLIuiSiwu5mAkAJMB8cbBooiW4XJtAIqcRLkvmuNiT9prTVLYreXdjjcDT4K5gvQ"]',
    )
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