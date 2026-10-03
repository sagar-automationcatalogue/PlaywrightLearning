const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/);
  await page.locator('a[href*="directory"]').first().click();
  await page.waitForURL(/.*directory/);
  await page.waitForLoadState('networkidle');

  console.log('SEARCH_ICON_COUNT', await page.locator('.corporate-search-icon').count());
  const searchIcon = page.locator('.corporate-search-icon');
  if (await searchIcon.count()) {
    await searchIcon.click();
    await page.waitForLoadState('networkidle');
    console.log('INPUT_AFTER_CLICK_COUNT', await page.locator('#_value').count());
    console.log('SEARCH_INPUT_VISIBLE', await page.locator('#_value').isVisible().catch(() => false));
  }

  await browser.close();
})();
