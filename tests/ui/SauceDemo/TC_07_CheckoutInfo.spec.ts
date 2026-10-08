import {test , expect} from '@playwright/test'
import { TC_07_CheckoutInfo } from '../../../test-data/sauceDemo.ts';

/** Testcase developed by Tarun - Need to check Completed */
test('@sanity TC_07_CheckoutInfo:Checkout Information Required-Field Validation and Recovery', async({browser}) => {

const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://www.saucedemo.com/');
await page.getByPlaceholder('Username').fill(TC_07_CheckoutInfo.username);
await page.getByPlaceholder('Password').fill(TC_07_CheckoutInfo.password);
await page.getByRole('button').click();
const loadedurl = await page.url();
console.log('loaded url is ' + loadedurl);
await page.getByRole('button', { name: 'Open Menu' }).click();
await page.getByRole('button', { name: 'Reset App State' }).click();//Close Menu
await page.getByRole('button', { name: 'Close Menu' }).click();
await page.locator(`#add-to-cart-${TC_07_CheckoutInfo.productId}`).click();
await page.locator('//a[@data-test="shopping-cart-link"]').click();
await page.getByText(TC_07_CheckoutInfo.productName, {exact : true}).first();
await page.getByRole('button',{ name: 'checkout' }).click();
const firstname = await page.getByPlaceholder('First Name');
await firstname.isVisible();
await page.getByPlaceholder('Last Name').isVisible;
await page.getByPlaceholder('Zip/Postal Code').isVisible;
await page.getByRole('button', { name : 'continue' }).click();
const errormsg = await page.getByText(TC_07_CheckoutInfo.errors.firstNameRequired).innerText();
//const errormsg2 = await errormsg.textContent();
console.log('Error is ' + errormsg);

const loadedurl1 = await page.url();
console.log('loaded url is ' + loadedurl1);

await firstname.fill(TC_07_CheckoutInfo.firstName);
await page.getByRole('button', { name : 'continue' }).click();
const errormsg1 = await page.getByText(TC_07_CheckoutInfo.errors.lastNameRequired).innerText();
console.log('Error is ' + errormsg1);
await page.getByPlaceholder('Last Name').fill(TC_07_CheckoutInfo.lastName);
await page.getByRole('button', { name : 'continue' }).click();
const errormsg2 = await page.getByText(TC_07_CheckoutInfo.errors.postalCodeRequired).innerText();
console.log('Error is ' + errormsg2);
await page.getByPlaceholder('Zip/Postal Code').fill(TC_07_CheckoutInfo.postalCode);
await page.getByRole('button', { name : 'continue' }).click();

const loadedurl2 = await page.url();
console.log('loaded url is ' + loadedurl2);

const overview = await page.locator('[data-test="title"]').textContent();
console.log(overview);
await page.getByText(TC_07_CheckoutInfo.productName, {exact : true}).first();

await page.getByRole('button', {name : 'cancel'}).click();

const loadedurl3 = await page.url();
console.log('loaded url is ' + loadedurl3);
const cartvalue = await page.getByText('1', { exact: true }).first().innerText();
console.log(cartvalue);
await page.locator('//a[@data-test="shopping-cart-link"]').click();
await page.getByRole('button',{ name: 'checkout' }).click();
await firstname.fill(TC_07_CheckoutInfo.firstName);
await firstname.clear();
await expect(firstname).toBeEmpty();
await page.getByRole('button', {name : 'cancel'}).click();
await page.getByText('Your Cart', { exact: true }).first()
await page.getByRole('button', {name : 'Remove'}).click();

const latestcartvalue = await page.locator(`[data-test='shopping-cart-link']`).innerText();
console.log(latestcartvalue);

await page.waitForTimeout(5000);

});