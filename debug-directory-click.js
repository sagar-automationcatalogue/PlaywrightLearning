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
  await page.waitForTimeout(5000);

  const targetName = 'Mazie Abraham';
  const cards = page.locator('.employee-card');
  console.log('CARD_COUNT_BEFORE', await cards.count());
  const matched = page.locator('.employee-card').filter({ hasText: targetName }).first();
  console.log('MATCHED_COUNT', await matched.count());

  if (await matched.count()) {
    console.log('MATCHED_TEXT', await matched.textContent());
    await matched.click();
    await page.waitForTimeout(3000);
    const detailText = await page.locator('body').innerText();
    console.log('DETAIL_BODY=', detailText.slice(0, 5000));

    const matchedEls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).filter((el) => {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        return /Aaron|Hamilton|Employee|Profile|Details|Job|Title|Location|ID|Department|Phone|Email/i.test(text) && text.length > 0;
      }).slice(0, 200).map((el) => ({
        tag: el.tagName,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        className: el.className ? String(el.className) : ''
      }));
    });

    console.log(JSON.stringify(matchedEls, null, 2));
  }

  await browser.close();
})();
