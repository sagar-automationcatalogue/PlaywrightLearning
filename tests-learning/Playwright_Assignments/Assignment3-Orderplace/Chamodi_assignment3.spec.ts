import {test} from '@playwright/test';

test('Demo web shop', async({page})=> {

    await page.goto('https://demowebshop.tricentis.com/');
    
    await page.getByRole('link', {name:'Log in'}).click();
    
    await page.getByRole('textbox', {name:'Email'}).fill('hashani13456@test.com');
    await page.locator('#Password').fill('Hashani1234');
    await page.getByRole('button', {name:'Log in'}).click();

    await page.locator('.block.block-category-navigation').getByRole('link', {name:'Computers'}).click();
    await page.waitForTimeout(2000);

    await page.getByAltText('Picture for category Notebooks').click();
    await page.getByRole('button', {name:'Add to cart'}).first().click();

    await page.locator('.header-links').getByRole('link', {name:'Shopping cart'}).click();
    await page.waitForTimeout(2000);

    await page.locator('.country-input').selectOption('209');
    await page.locator('#termsofservice').click();
    await page.getByRole('button', {name:'checkout'}).click();
    await page.waitForTimeout(2000);

    await page.locator('.country-input').selectOption('209');
    await page.getByLabel('City:').fill('Kegalle');
    await page.getByLabel('Address 1:').fill('605, Ranwala, Kegalle');
    await page.getByLabel('Zip / postal code:').fill('71000');
    await page.getByLabel('Phone number:').fill('0776585576');
    await page.getByRole('button', {name:'Continue'}).click();
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('button', {name:'Continue'}).click();

    await page.getByRole('button', {name:'Continue'}).click();

    await page.getByRole('button', {name:'continue'}).click();

    await page.getByRole('button', {name:'continue'}).click();
    await page.getByRole('button', {name:'Confirm'}).click();

    await page.getByRole('button', {name:'Continue'}).click();
    await page.locator(".header-links").getByRole('link', { name: 'Logout' }).click();
    







})