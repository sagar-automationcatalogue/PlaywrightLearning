import { test, expect } from '@playwright/test';

test('Demo Web Shop Login Testcase', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://demowebshop.tricentis.com/register');
  await page.locator('#gender-female').click();
  await page.locator('#FirstName').fill('Soujanya');
  await page.locator('#LastName').fill('Nara');
  await page.locator('#Email').fill('soujanya.27@gmail.com');
  await page.locator('#Password').fill('Test@1234');
  await page.locator('#ConfirmPassword').fill('Test@1234');
  await page.locator('#register-button').click();
  await page.locator('.ico-logout').click();
  await page.locator('.ico-login').click();
  await page.locator('#Email').fill('soujanya.27@gmail.com');
  await page.locator('#Password').fill('Test@1234');
  await page.locator('.button-1.login-button').click();

  const userEmailLink = page.locator('.account').first();
  await expect(userEmailLink).toHaveText('soujanya.27@gmail.com');

  const userEmailText = await userEmailLink.textContent();
  console.log('Logged in user email:', userEmailText?.trim());
});