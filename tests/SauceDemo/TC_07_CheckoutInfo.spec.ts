import {test , expect} from '@playwright/test'

test('Checkout Information Required-Field Validation and Recovery', async({browser}) => {

const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://www.saucedemo.com/');
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByPlaceholder('Password').fill('secret_sauce');
await page.getByRole('button').click();
const loadedurl = await page.url();
console.log('loaded url is ' + loadedurl);
await page.getByRole('button', { name: 'Open Menu' }).click();
await page.getByRole('button', { name: 'Reset App State' }).click();//Close Menu
await page.getByRole('button', { name: 'Close Menu' }).click();
await page.locator(`#add-to-cart-sauce-labs-bike-light`).click();
await page.locator('//a[@data-test="shopping-cart-link"]').click();
await page.getByText('Sauce Labs Bike Light', {exact : true}).first();
await page.getByRole('button',{ name: 'checkout' }).click();
const firstname = await page.getByPlaceholder('First Name');
await firstname.isVisible();
await page.getByPlaceholder('Last Name').isVisible;
await page.getByPlaceholder('Zip/Postal Code').isVisible;
await page.getByRole('button', { name : 'continue' }).click();
const errormsg = await page.getByText('Error: First Name is required').innerText();
//const errormsg2 = await errormsg.textContent();
console.log('Error is ' + errormsg);

const loadedurl1 = await page.url();
console.log('loaded url is ' + loadedurl1);

await firstname.fill('Playwright');
await page.getByRole('button', { name : 'continue' }).click();
const errormsg1 = await page.getByText('Error: Last Name is required').innerText();
console.log('Error is ' + errormsg1);
await page.getByPlaceholder('Last Name').fill('Student');
await page.getByRole('button', { name : 'continue' }).click();
const errormsg2 = await page.getByText('Error: Postal Code is required').innerText();
console.log('Error is ' + errormsg2);
await page.getByPlaceholder('Zip/Postal Code').fill('500081');
await page.getByRole('button', { name : 'continue' }).click();

const loadedurl2 = await page.url();
console.log('loaded url is ' + loadedurl2);

const overview = await page.locator('[data-test="title"]').textContent();
console.log(overview);
await page.getByText('Sauce Labs Bike Light', {exact : true}).first();

await page.getByRole('button', {name : 'cancel'}).click();

const loadedurl3 = await page.url();
console.log('loaded url is ' + loadedurl3);
const cartvalue = await page.getByText('1', { exact: true }).first().innerText();
console.log(cartvalue);
await page.locator('//a[@data-test="shopping-cart-link"]').click();
await page.getByRole('button',{ name: 'checkout' }).click();
await firstname.fill('Playwright');
await firstname.clear();
await expect(firstname).toBeEmpty();
await page.getByRole('button', {name : 'cancel'}).click();
await page.getByText('Your Cart', { exact: true }).first()
await page.getByRole('button', {name : 'Remove'}).click();

const latestcartvalue = await page.locator(`[data-test='shopping-cart-link']`).innerText();
console.log(latestcartvalue);

await page.waitForTimeout(5000);

});