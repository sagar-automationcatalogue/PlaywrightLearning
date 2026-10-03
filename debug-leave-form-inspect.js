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
    'https://automation44-trials8101.orangehrmlive.com/client/#/leave/add_leave_entitlement',
    'https://automation44-trials8101.orangehrmlive.com/client/#/leave/assign',
    'https://automation44-trials8101.orangehrmlive.com/client/#/leave/view_leave_list'
  ];

  for (const route of routes) {
    console.log('=== ROUTE ===', route);
    await page.goto(route);
    await page.waitForTimeout(4000);
    const bodyText = await page.locator('body').innerText();
    console.log('PAGE TITLE / URL', page.url());
    console.log(bodyText.slice(0, 2000));

    const elements = await page.locator('input, select, textarea, button, a').evaluateAll((els) => els.map((el) => ({
      tag: el.tagName,
      type: el.getAttribute('type') || '',
      placeholder: el.getAttribute('placeholder') || '',
      id: el.id || '',
      name: el.getAttribute('name') || '',
      ariaLabel: el.getAttribute('aria-label') || '',
      className: (el.className || '').toString(),
      text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
      value: el.getAttribute('value') || ''
    })));

    const filtered = elements.filter((x) => /Employee|Leave|Entitlement|Comment|Date|Name|Search|Type|Save|Cancel|Assign|Reset/i.test(`${x.placeholder} ${x.id} ${x.name} ${x.ariaLabel} ${x.className} ${x.text}`));
    console.log(JSON.stringify(filtered.slice(0, 200), null, 2));
    console.log('-----');
  }

  await browser.close();
})();
