const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });
  console.log('DASHBOARD', page.url());

  const items = await page.locator('a, button').evaluateAll((els) => els.map((el) => ({
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    href: el.getAttribute('href') || '',
    className: (el.className || '').toString(),
    id: el.id || ''
  })));
  console.log(JSON.stringify(items.filter((x) => /Leave|Assign Leave|Entitlement|Leave List|Employee List|Directory/i.test(`${x.text} ${x.href} ${x.className} ${x.id}`)).slice(0, 300), null, 2));

  const leaveLink = page.locator('a[href*="leave"], button:has-text("Leave")').first();
  console.log('LEAVE_COUNT', await leaveLink.count());
  if (await leaveLink.count()) {
    const href = await leaveLink.getAttribute('href');
    console.log('LEAVE_HREF', href);
    await leaveLink.click();
    await page.waitForURL(/.*leave/, { timeout: 30000 });
    console.log('AFTER_LINK', page.url());
    console.log((await page.locator('body').innerText()).slice(0, 5000));
  }

  await browser.close();
})();
