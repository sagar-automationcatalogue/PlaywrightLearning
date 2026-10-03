const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });

  await page.locator('a[href*="directory"]').first().click();
  await page.waitForURL(/.*directory/, { timeout: 30000 });
  await page.waitForTimeout(8000);

  const bodyText = await page.locator('body').innerText();
  console.log('BODY_TEXT=', bodyText.slice(0, 10000));

  const types = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*')).filter((el) => {
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      const className = el.className ? String(el.className) : '';
      const id = el.id || '';
      const role = el.getAttribute('role') || '';
      const placeholder = el.getAttribute('placeholder') || '';
      const name = el.getAttribute('name') || '';
      return /Directory|Search|Employee|Location|Loading|Director|job|department|title|profile|card|filter|name/i.test(`${text} ${className} ${id} ${role} ${placeholder} ${name}`);
    }).slice(0, 200).map((el) => ({
      tag: el.tagName,
      text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
      className: el.className ? String(el.className) : '',
      id: el.id || '',
      role: el.getAttribute('role') || '',
      placeholder: el.getAttribute('placeholder') || '',
      name: el.getAttribute('name') || ''
    }));
  });

  console.log(JSON.stringify(types, null, 2));

  const possibleCards = await page.locator('[class*="card"], [class*="result"], [class*="employee"], [data-v-uuid], .oxd-grid-item, .orangehrm-directory-card, .employee-card').count();
  console.log('POSSIBLE_CARD_COUNT', possibleCards);

  await browser.close();
})();
