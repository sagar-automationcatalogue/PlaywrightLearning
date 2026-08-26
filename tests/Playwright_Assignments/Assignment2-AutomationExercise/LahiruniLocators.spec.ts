import {test} from '@playwright/test';
test('Demo Web Shop ', async({page}) =>{

await page.goto('https://demowebshop.tricentis.com/');
await page.getByText('Log in').click();
await page.getByLabel('Email:').fill('Anna.smith@example.com');
await page.getByLabel('Password:').fill('Password123');
await page.locator('#RememberMe').check();
await page.getByRole('button', { name: 'Log in' }).click();

await page.locator("(//a[normalize-space()='Computers'])[1]").click();


await page.getByRole('link', {name: 'Notebooks',exact: true}).click();
await page.getByRole('link', { name: 'Add to cart' }).click();

await page.getByRole('link', { name: 'Shopping cart (1)' }).click();



























});