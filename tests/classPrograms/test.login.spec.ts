import { test } from '@playwright/test';

test('My First Playwright test', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  console.log('I am in the Playwright test');
});

test('My Second Playwright test', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  console.log('I am in the Playwright test');
});

test('My Third Playwright test', async ({ browser }) => {
  const context = await browser.newContext();
  console.log(typeof context);
  const page = await context.newPage();
  await page.goto('https://www.google.com');
});