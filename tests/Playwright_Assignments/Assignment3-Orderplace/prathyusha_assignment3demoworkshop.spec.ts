import { test } from '@playwright/test';

test(`playwright in-built locators`, async ({page}) => {

    await page.goto('https://demowebshop.tricentis.com/');

    await page.getByText('Log in').click();
    await page.getByRole('textbox', { name: 'Email' }).fill('tirunap93@gmail.com');
    await page.locator('#Password').fill('Vrundhavan@1991');

    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('.block.block-category-navigation').getByText('Computers').click();

    await page.getByAltText('Picture for category Notebooks').click();

   await page.getByRole('button', { name: 'Add to cart' }).click();
  //  await page.waitForTimeout(3000);
   await page.locator('#topcartlink').getByText('Shopping cart').click();

   await page.locator('.country-input').selectOption({label:'Canada'});
   await page.locator('.state-input').selectOption({label:'Ontario'});
   await page.locator('.zip-input').fill('L6Z3W5');
//wait page.getByRole('checkbox', { name: 'termsofservice' }).getByText('I agree with the terms of service and I adhere to them unconditionally').check();

   await page.locator('#termsofservice').check();

   await page.locator('#checkout').click();
   await page.locator('#billing-address-select').selectOption({label:'New Address'});
  await page.locator('#BillingNewAddress_CountryId').selectOption({label:'Canada'});
    await page.getByLabel('City:').fill('toronto');
    await page.getByLabel('Address 1:').fill('26 silver stream rd');
   
     await page.getByLabel('Zip / postal code:').fill('L6Z3W5');
    await page.getByLabel('Phone number:').fill('12345678');
     

await page.locator('#billing-buttons-container').getByTitle('Continue').click();
await page.locator('#shipping-buttons-container').getByTitle('Continue').click();
await page.getByLabel('Ground (0.00)').check();
await page.locator('#shipping-method-buttons-container').locator('.button-1.shipping-method-next-step-button').click();
await page.getByLabel('Cash On Delivery (COD) (7.00)').check();
await page.locator('#payment-method-buttons-container').locator('.button-1.payment-method-next-step-button').click();
await page.locator('#payment-info-buttons-container').locator('.button-1.payment-info-next-step-button').click();
await page.locator('#confirm-order-buttons-container').locator('.button-1.confirm-order-next-step-button').click();
const title = await page.locator('.title').getByText('Your order has been successfully processed!');
console.log('title');




await page.waitForTimeout(3000);

});