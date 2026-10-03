const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });

  await page.goto('https://automation44-trials8101.orangehrmlive.com/client/#/leave/add_leave_entitlement');
  await page.waitForTimeout(6000);

  console.log('URL_AFTER', page.url());
  console.log((await page.locator('body').innerText()).slice(0, 8000));

  const inputs = await page.locator('input, select, textarea').evaluateAll((els) => els.map((el) => ({
    tag: el.tagName,
    placeholder: el.getAttribute('placeholder') || '',
    id: el.id || '',
    name: el.getAttribute('name') || '',
    className: (el.className || '').toString(),
    value: el.getAttribute('value') || ''
  })));
  console.log(JSON.stringify(inputs.filter((x) => /Employee|Leave|Type|Entitlement|Date|Comment|Search|Name|No of Days/i.test(`${x.placeholder} ${x.id} ${x.name} ${x.className}`)).slice(0, 200), null, 2));

  const buttons = await page.locator('button, a').evaluateAll((els) => els.map((el) => ({
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    className: (el.className || '').toString(),
    id: el.id || ''
  })));
  console.log(JSON.stringify(buttons.filter((x) => /Save|Cancel|Search|Add|Assign|Reset|Delete|Yes|OK|Submit/i.test(`${x.text} ${x.className} ${x.id}`)).slice(0, 200), null, 2));

  await browser.close();
})();
