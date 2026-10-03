const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });
  console.log('LOGIN_OK', page.url());

  const menuText = await page.locator('a, button').evaluateAll((els) => els.map((el) => ({
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    href: el.getAttribute('href') || '',
    id: el.id || '',
    className: (el.className || '').toString()
  })));

  console.log(JSON.stringify(menuText.filter((x) => /Directory|directory|Employee|Location|Search/i.test(`${x.text} ${x.href} ${x.id} ${x.className}`)).slice(0, 200), null, 2));

  const directoryLink = page.locator('a[href*="directory"]').first();
  console.log('COUNT_DIRECTORY', await directoryLink.count());

  if (await directoryLink.count()) {
    await directoryLink.click();
    await page.waitForURL(/.*directory/, { timeout: 30000 });
    console.log('URL_AFTER_DIR', page.url());

    console.log('BODY_TEXT_START');
    console.log((await page.locator('body').innerText()).slice(0, 5000));
    console.log('BODY_TEXT_END');

    const inputs = await page.locator('input, select').evaluateAll((els) => els.map((el) => ({
      placeholder: el.getAttribute('placeholder') || '',
      id: el.id || '',
      name: el.getAttribute('name') || '',
      type: el.getAttribute('type') || '',
      value: el.getAttribute('value') || ''
    })));

    console.log('INPUTS', JSON.stringify(inputs.slice(0, 200), null, 2));

    const buttons = await page.locator('button, a').evaluateAll((els) => els.map((el) => ({
      text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
      className: (el.className || '').toString(),
      href: el.getAttribute('href') || ''
    })));

    console.log('BUTTONS', JSON.stringify(buttons.filter((x) => /Search|Reset|Location|Employees|Employee|Directory|View|Close|Cancel|Apply|Filter/i.test(`${x.text} ${x.className} ${x.href}`)).slice(0, 200), null, 2));
  }

  await browser.close();
})();
