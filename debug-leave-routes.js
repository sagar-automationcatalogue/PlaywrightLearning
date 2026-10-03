const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });

  const routes = [
    '#/leave/view_leave_list',
    '#/leave/assign',
    '#/leave/apply',
    '#/leave/entitlements',
    '#/leave/entitlements/add',
    '#/leave/entitlements/add_entitlement',
    '#/leave/entitlement',
    '#/leave/entitlement/add',
    '#/leave/view_entitlements'
  ];

  for (const route of routes) {
    await page.goto('https://automation44-trials8101.orangehrmlive.com/client/' + route);
    await page.waitForTimeout(3000);
    const body = (await page.locator('body').innerText()).slice(0, 2000);
    console.log('ROUTE', route, 'URL', page.url());
    console.log(body);
    console.log('---');
  }

  await browser.close();
})();
