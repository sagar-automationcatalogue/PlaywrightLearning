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

  const input = page.locator('#_value');
  console.log('INPUT_COUNT', await input.count());
  console.log('INPUT_VISIBLE', await input.isVisible().catch(() => false));
  await input.fill('Mazie');
  await page.waitForLoadState('networkidle');
  console.log('AFTER_FILL_BODY', (await page.locator('body').innerText()).slice(0, 3000));
  console.log('DROPDOWN_COUNT', await page.locator('.angucomplete-dropdown').count());
  console.log('DROPDOWN_VISIBLE', await page.locator('.angucomplete-dropdown').isVisible().catch(() => false));
  console.log('ROWS', await page.locator('.angucomplete-row').count());
  console.log('ROW_TEXTS', JSON.stringify(await page.locator('.angucomplete-row').allTextContents().slice(0, 20), null, 2));

  await browser.close();
})();
