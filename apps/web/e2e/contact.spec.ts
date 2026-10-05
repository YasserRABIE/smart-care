import { expect, test } from '@playwright/test'

test('contact page embeds the Google map and links contacts to their targets', async ({ page }) => {
  await page.goto('/contact')

  const map = page.locator('iframe[title="Map showing the Smart Care Medical office"]')
  await map.scrollIntoViewIfNeeded()
  await expect(map).toHaveAttribute('src', /google\.com\/maps.*output=embed/)
  // The embed loads inside the iframe (needs network access to Google).
  await expect(page.frameLocator('iframe[title^="Map"]').locator('body')).not.toBeEmpty({
    timeout: 15_000,
  })

  await expect(page.getByRole('link', { name: /Open in Google Maps/ })).toHaveAttribute(
    'href',
    /google\.com\/maps\/search/,
  )
  await expect(page.locator('a[href^="tel:"]').first()).toBeVisible()
  // Email is plain text, not a link.
  await expect(page.locator('a[href*="mail"]')).toHaveCount(0)
})
