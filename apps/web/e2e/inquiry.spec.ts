import { expect, test } from '@playwright/test'

test('Send Inquiry on a product prefills the contact form and sends it', async ({ page }) => {
  await page.goto('/products/surgical-specialties')
  await page.getByRole('link', { name: /Send Inquiry.*Precision Dissection Scissors/ }).click()

  await expect(page).toHaveURL(/\/contact\?product=precision-dissection-scissors/)
  const form = page.locator('#inquiry')
  await expect(form.getByLabel(/^Subject/)).toHaveValue(
    'Needing help with Precision Dissection Scissors',
  )
  await expect(form.getByText('About: Precision Dissection Scissors')).toBeVisible()

  // Invalid submit shows inline errors without leaving the page.
  await form.getByRole('button', { name: 'Send Inquiry' }).click()
  await expect(form.getByText('Please enter your full name')).toBeVisible()

  await form.getByLabel(/^Full Name/).fill('E2E Test Buyer')
  await form.getByLabel(/^Email Address/).fill('e2e@example.com')
  await form.getByLabel(/^Message/).fill('Automated end-to-end test, please ignore.')
  await form.getByRole('button', { name: 'Send Inquiry' }).click()

  await expect(page.getByRole('heading', { name: 'Message sent' })).toBeVisible()
})
