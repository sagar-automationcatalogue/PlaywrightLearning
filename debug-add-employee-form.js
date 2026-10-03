const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });

  await page.locator('[data-automation-id="menu_pim_viewEmployeeList"]').first().click();
  await page.waitForURL(/.*pim.*employees/, { timeout: 30000 });

  const addButton = page.locator('#addEmployeeButton');
  await addButton.click();
  await page.waitForURL(/.*pim\/addEmployee|.*pim\/edit\/|.*employees\//, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(5000);

  console.log('URL after click:', page.url());
  console.log('Page title:', await page.title());

  const fields = await page.locator('input, textarea').evaluateAll((els) => els.map((el) => ({
    tag: el.tagName,
    id: el.id || '',
    name: el.getAttribute('name') || '',
    type: el.getAttribute('type') || '',
    value: el.value || '',
    placeholder: el.getAttribute('placeholder') || '',
    className: (el.className || '').toString()
  })).filter((x) => {
    const text = `${x.id} ${x.name} ${x.placeholder}`.toLowerCase();
    return x.type === 'file' || /first|middle|last|employee|profile|id/i.test(text);
  }));

  console.log(JSON.stringify(fields, null, 2));
  console.log('BODY:', await page.locator('body').innerText());
  await browser.close();
})();
