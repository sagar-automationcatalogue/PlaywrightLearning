import {test} from '@playwright/test';

test(`Placing order using locators`, async({page}) =>{
    await page.goto(`https://demowebshop.tricentis.com/`);
    await page.waitForTimeout(3000);
    await page.getByText('Log in').click();
await page.getByLabel('Email:').fill('vijetha.g20@gmail.com');
await page.getByLabel('Password:').fill('Test@123');
await page.locator('#RememberMe').check();
await page.getByRole('button', { name: 'Log in' }).click();

await page.getByRole('link', { name: 'Computers', exact: true }).first().click();

await page.locator('.sub-category-item').getByRole('link', { name: 'Notebooks', exact: true }).click();
await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.waitForTimeout(3000);
await page.locator("//li[@id='topcartlink']").getByRole('link', { name: 'Shopping cart' }).click();

await page.locator('.country-input').selectOption({ value: '209' });
await page.locator('#termsofservice').check();

await page.getByRole('button', { name: 'checkout' }).click();
    await page.waitForTimeout(3000);
await page.locator('#BillingNewAddress_CountryId').selectOption('2');
await page.locator('#StateProvinceId').selectOption({ value: '71' });
await page.getByRole('button', { name: 'Estimate shipping' }).click();
 await page.getByRole('checkbox', {name:'termsofservice'}).check();
    await page.waitForTimeout(3000);
 await page.getByRole('button', { name: 'checkout' }).click();
    await page.waitForTimeout(3000);
await page.getByLabel('City:').fill('Etobicoke');
await page.getByLabel('Address 1:').fill('1410, Cordova Ave');
await page.getByLabel('Zip / postal code:').fill('M9A4P2');
await page.getByLabel('Phone number:').fill('1435626633');

await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('checkbox', { name: 'PickUpInStore' }).check();

await page.getByRole('button', { name: 'Continue' }).click();


await page.getByRole('button', { name: 'Continue' }).click();

await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('button', { name: 'Confirm' }).click();
await page.getByText('Click here for order details.').click();
await page.getByRole('link', { name: 'Download PDF invoice' }).click();

await page.locator(".header-links").getByRole('link', { name: 'Logout' }).click();

})

