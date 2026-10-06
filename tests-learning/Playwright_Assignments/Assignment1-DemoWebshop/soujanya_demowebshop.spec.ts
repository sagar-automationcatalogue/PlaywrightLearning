import { test, expect } from '@playwright/test';

test('Demo Web Shop Login Testcase', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://demowebshop.tricentis.com/');
  await page.locator('.ico-register').click();
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

test('Demo Web Shop Place an order', async ({page}) => {
  await page.goto('https://demowebshop.tricentis.com/');
  await page.getByText('Log in').click();
  await page.getByRole('textbox', {name: 'Email' }).fill('soujanya.27@gmail.com');
  await page.locator('#Password').fill('Test@1234');
  await page.getByRole('button', {name: 'Log in' }).click();
  await page.getByText('Computers').nth(0).click();
  await page.getByAltText('Picture for category Notebooks').click();
  await page.getByRole('button', {name: 'Add to cart' }).click();
  await expect(page.getByText('The product has been added to your shopping cart')).toBeVisible();
  await page.getByText('Shopping cart').nth(1).click();
  await page.getByRole('checkbox').nth(0).click();
  await page.getByRole('checkbox').nth(1).click();
  await page.getByRole('button', {name: 'checkout'}).click();
  await page.getByLabel('Company').fill('Google');
  await page.getByLabel('Country').selectOption('Canada');
  await page.getByLabel('State / province').selectOption('Quebec');
  await page.getByLabel('City').fill('Montreal');
  await page.getByLabel('Address 1').fill('123 Main St');
  await page.getByLabel('Zip / postal code').fill('T6X 0H5');
  await page.getByLabel('Phone Number').fill('2367894510');
  await page.getByRole('button', { name: 'Continue' }).click();

});


test('Demo Web Shop Place an order - Desktops', async ({page}) => {
  await page.goto('https://demowebshop.tricentis.com/');
  await page.getByText('Log in').click();
  await page.getByRole('textbox', {name: 'Email' }).fill('soujanya.27@gmail.com');
  await page.locator('#Password').fill('Test@1234');
  await page.getByRole('button', {name: 'Log in' }).click();
  await page.locator('.block-category-navigation').getByRole('link', { name: 'Computers' }).click();
  await page.locator('.sub-category-grid').getByText('Desktops').click();
  await page.locator('.product-item').first().getByRole('button', { name: 'Add to cart' }).click();
  
  await page.locator('.product-essential').getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('#topcartlink').getByText('Shopping cart').click();
  await page.waitForTimeout(4000);
  await page.locator('#CountryId').selectOption('2');
  await page.locator('#StateProvinceId').selectOption('73');
  await page.locator('#termsofservice').click();
  await page.getByRole('button', {name: 'checkout'}).click();
  await page.getByLabel('Country').selectOption('Canada');
  await page.getByLabel('State / province').selectOption('Quebec');
  await page.getByLabel('City').fill('Montreal');
  await page.getByLabel('Address 1').fill('123 Main St');
  await page.getByLabel('Zip / postal code').fill('T6X 0H5');
  await page.getByLabel('Phone Number').fill('2367894510');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();






});