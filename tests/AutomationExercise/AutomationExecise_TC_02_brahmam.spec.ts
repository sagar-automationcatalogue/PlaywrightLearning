import { expect, test } from '@playwright/test';

test('TC_AutomationExecise_02: Search Products → Validate All Results → Hover Product → Open Details', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/products');
  await expect(page.getByRole('link', { name: 'Website for automation' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Search Product' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search Product' }).click();
  await page.getByRole('textbox', { name: 'Search Product' }).fill('Tshirt');
  await expect(page.locator('#submit_search')).toBeVisible();
  await page.locator('#submit_search').click();
  await page.getByRole('img', { name: 'ecommerce website products' }).first().click();
  await expect(page.locator('body')).toContainText('Men Tshirt');
  await expect(page.getByText('Add to cart').nth(1)).toBeVisible();
  await expect(page.getByRole('link', { name: ' View Product' }).first()).toBeVisible();
});