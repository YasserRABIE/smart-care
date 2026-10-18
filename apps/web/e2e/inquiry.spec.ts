import { expect, test } from '@playwright/test'

test('Send Inquiry on a product prefills the form and opens WhatsApp with the message', async ({
  page,
}) => {
  // Capture the WhatsApp URL instead of opening a real tab.
  await page.addInitScript(() => {
    window.open = (url) => {
      ;(window as Window & { openedUrl?: string }).openedUrl = String(url)
      return null
    }
  })

  await page.goto('/products/surgical-specialties')
  await page.getByRole('link', { name: /Send Inquiry.*Precision Dissection Scissors/ }).click()

  await expect(page).toHaveURL(/\/contact\?product=precision-dissection-scissors/)
  const form = page.locator('#inquiry')
  await expect(form.getByLabel(/^Subject/)).toHaveValue(
    'Needing help with Precision Dissection Scissors',
  )
  await expect(form.getByText('About: Precision Dissection Scissors')).toBeVisible()

  // Invalid submit shows inline errors and opens nothing.
  const submit = form.getByRole('button', { name: /Send via WhatsApp/ })
  await submit.click()
  await expect(form.getByText('Please enter your full name')).toBeVisible()
  expect(await page.evaluate(() => (window as Window & { openedUrl?: string }).openedUrl)).toBe(
    undefined,
  )

  await form.getByLabel(/^Full Name/).fill('E2E Test Buyer')
  await form.getByLabel(/^Message/).fill('Automated end-to-end test, please ignore.')
  await submit.click()

  await expect(page.getByRole('heading', { name: 'Continue in WhatsApp' })).toBeVisible()
  const openedUrl = await page.evaluate(
    () => (window as Window & { openedUrl?: string }).openedUrl ?? '',
  )
  expect(openedUrl).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
  const text = decodeURIComponent(openedUrl.split('?text=')[1] ?? '')
  expect(text).toContain('*Subject:* Needing help with Precision Dissection Scissors')
  expect(text).toContain('*Product:* Precision Dissection Scissors')
  expect(text).toContain('*Name:* E2E Test Buyer')
  expect(text).not.toContain('*Email:*')
  await expect(page.getByRole('link', { name: /Open WhatsApp/ })).toHaveAttribute('href', openedUrl)
})
