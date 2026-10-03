const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });

  console.log('URL after login:', page.url());
  const bodyText = await page.locator('body').innerText();
  console.log(bodyText.slice(0, 2000));

  const adminLinks = await page.locator('a, button').evaluateAll((els) => els.map((el) => ({
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    tag: el.tagName,
    className: (el.className || '').toString(),
    id: el.id || ''
  }))); 
  console.log('Admin-related items:', JSON.stringify(adminLinks.filter((x) => /Admin|Users|Manage User Roles|HR Administration|Employee Management/i.test(`${x.text} ${x.className} ${x.id}`)).slice(0, 80), null, 2));

  const hrAdmin = page.locator('#menu_item_101').first();
  console.log('HR Admin count:', await hrAdmin.count());
  if (await hrAdmin.count()) {
    await hrAdmin.click();
    await page.waitForTimeout(5000);
    console.log('URL after HR Admin click:', page.url());
    const bodyAfter = await page.locator('body').innerText();
    console.log('BODY_TEXT_START');
    console.log(bodyAfter.slice(0, 4000));
    console.log('BODY_TEXT_END');
  }

  const usersLink = page.locator('a[href="#/admin/systemUsers"]').first();
  console.log('System Users link count:', await usersLink.count());
  if (await usersLink.count()) {
    await usersLink.click();
    await page.waitForTimeout(5000);
    console.log('URL after Users click:', page.url());
    const finalBody = await page.locator('body').innerText();
    console.log('FINAL_BODY_START');
    console.log(finalBody.slice(0, 5000));
    console.log('FINAL_BODY_END');
  }

  const addUserCount = await page.locator('text=Add User').count();
  console.log('Add User text count:', addUserCount);
  const addButtonCount = await page.locator('button:has-text("Add")').count();
  console.log('Add button count:', addButtonCount);

  const buttonTexts = await page.locator('button, a').evaluateAll((els) => els.map((el) => ({
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    tag: el.tagName,
    href: el.getAttribute('href') || '',
    className: (el.className || '').toString()
  })));
  console.log(JSON.stringify(buttonTexts.filter((x) => /Add|User|Username|Employee|Role|Status|Reset|Delete|Save|Cancel|Disabled|Enabled/i.test(`${x.text} ${x.href} ${x.className}`)).slice(0, 200), null, 2));

  await browser.close();
})();
