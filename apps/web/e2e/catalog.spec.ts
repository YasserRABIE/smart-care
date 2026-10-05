import { expect, test, type Page } from '@playwright/test'

const cards = (page: Page) => page.locator('main article h2')

test('filters, searches, and paginates the catalog through the URL', async ({ page }) => {
  await page.goto('/products/surgical-specialties')
  await expect(cards(page)).toHaveCount(6)

  await page.getByRole('link', { name: /^Urology/ }).click()
  await expect(page).toHaveURL(/category=urology/)
  await expect(cards(page)).toHaveCount(5)

  await page.getByRole('searchbox', { name: 'Search products' }).fill('laparo')
  await expect(page).toHaveURL(/category=urology&q=laparo/)
  await expect(cards(page)).toHaveText(['High-Definition Laparoscope'])

  await page.goto('/products/surgical-specialties')
  await page.getByRole('link', { name: 'Page 2' }).click()
  await expect(page).toHaveURL(/page=2/)
  await expect(page.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
})
