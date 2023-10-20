import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('http://localhost:5174/cards/christian')

  // Hacer clic en el enlace para iOS
  await page.getByRole('link', { name: 'add the card to your wallet for ios' }).click()

  // Verificar que se desencadenó el evento de descarga
  const download1 = await page.waitForEvent('download')
  expect(download1).not.toBeNull()
  expect(download1.url()).toContain('.zip') // Puedes adaptar esto según el tipo de archivo esperado

  // Hacer clic en el enlace para Android
  await page.getByRole('link', { name: 'add the card to your wallet for android' }).click()

  // Verificar que se desencadenó el evento de ventana emergente
  const page1 = await page.waitForEvent('popup')
  expect(page1).not.toBeNull()
  expect(page1.url()).toContain('android-popup-url') // Sustituye 'android-popup-url' por la URL esperada de la ventana emergente
})
