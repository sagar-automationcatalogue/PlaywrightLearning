import {test} from '@playwright/test';
test('Demo Web Shop ', async({page}) =>{

await page.goto('https://demowebshop.tricentis.com/');
await page.getByText('Log in').click();
await page.getByLabel('Email:').fill('Anna.smith@example.com');
await page.getByLabel('Password:').fill('Password123');
await page.locator('#RememberMe').check();
await page.getByRole('button', { name: 'Log in' }).click();

await page.locator("(//a[normalize-space()='Computers'])[1]").click();


await page.locator('.sub-category-item').getByRole('link', { name: 'Notebooks', exact: true }).click();
await page.getByRole('button', { name: 'Add to cart' }).first().click();

await page.locator("//li[@id='topcartlink']").getByRole('link', { name: 'Shopping cart' }).click();

await page.locator('.country-input').selectOption({ value: '209' });
await page.locator('#termsofservice').check();

await page.getByRole('button', { name: 'checkout' }).click();

await page.locator('.valid').selectOption({ value: '209'});
await page.getByLabel('City:').fill('Colombo');
await page.getByLabel('Address 1:').fill('1128, Galle Road');
await page.getByLabel('Zip / postal code:').fill('00300');
await page.getByLabel('Phone number:').fill('0711234567');

await page.getByRole('button', { name: 'Continue' }).click();


await page.getByRole('button', { name: 'Continue' }).click();


await page.getByRole('button', { name: 'Continue' }).click();

await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('button', { name: 'Confirm' }).click();

await page.getByRole('button', { name: 'Continue' }).click();
await page.locator(".header-links").getByRole('link', { name: 'Logout' }).click();





















});