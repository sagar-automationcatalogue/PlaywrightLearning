const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });

  await page.locator('a[href*="leave"]').first().click();
  await page.waitForURL(/.*leave/, { timeout: 30000 });
  await page.waitForLoadState('networkidle');

  const mainText = await page.locator('body').innerText();
  console.log(mainText.slice(0, 4000));

  const texts = [
    'Entitlements',
    'Add Entitlement',
    'Assign Leave',
    'Leave List',
    'Employee Name',
    'Leave Type',
    'Add'
  ];

  for (const text of texts) {
    const count = await page.getByText(text, { exact: false }).count();
    console.log('TEXT:', text, 'COUNT:', count);
    if (count > 0) {
      const arr = await page.getByText(text, { exact: false }).allTextContents();
      console.log(JSON.stringify(arr.slice(0, 20), null, 2));
    }
  }

  const inputs = await page.locator('input, select, textarea').evaluateAll((els) => els.map((el) => ({
    tag: el.tagName,
    placeholder: el.getAttribute('placeholder') || '',
    id: el.id || '',
    name: el.getAttribute('name') || '',
    className: (el.className || '').toString(),
    value: el.getAttribute('value') || ''
  })));
  console.log(JSON.stringify(inputs.filter((x) => /Employee|Leave|Type|Comment|Date|Name|Status|Entitlement/i.test(`${x.placeholder} ${x.id} ${x.name} ${x.className}`)).slice(0, 200), null, 2));

  await browser.close();
})();
