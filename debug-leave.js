const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });

  const menuItems = await page.locator('a, button').evaluateAll((els) => els.map((el) => ({
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    href: el.getAttribute('href') || '',
    className: (el.className || '').toString(),
    id: el.id || ''
  })));
  console.log(JSON.stringify(menuItems.filter((x) => /Leave|Entitlement|Assign Leave|Leave List|Employee|Search/i.test(`${x.text} ${x.href} ${x.className} ${x.id}`)).slice(0, 250), null, 2));

  const leaveLink = page.locator('a[href*="leave"]').first();
  console.log('LEAVE_LINK_COUNT', await leaveLink.count());
  if (await leaveLink.count()) {
    await leaveLink.click();
    await page.waitForURL(/.*leave/, { timeout: 30000 });
    console.log('AFTER_LEAVE', page.url());
    console.log((await page.locator('body').innerText()).slice(0, 5000));
  }

  await browser.close();
})();
