import {test} from '@playwright/test';

test('Playwright Chaining In-built Locators', async({page}) =>{
    await page.goto('https://automationexercise.com/');

    await page.getByRole('link', {name:'Signup / Login'}).click();
    await page.getByPlaceholder('Name').fill('Chamodi');
    await page.locator('.signup-form').getByPlaceholder('Email Address').fill('admin59123@gmail.com');
    await page.waitForTimeout(2000);
    await page.locator('.signup-form').getByRole('button', {name:'Signup'}).click();
    await page.waitForTimeout(2000);
    
    await page.getByLabel('Mrs.').check();
    await page.locator('#password').fill('Admin9876');
    await page.waitForTimeout(2000);

    await page.locator('#days').selectOption('20');
    await page.locator('#months').selectOption('6');
    await page.locator('#years').selectOption('1996');
    await page.waitForTimeout(2000);

    await page.locator('#newsletter').check();
    await page.locator('#optin').check();
    await page.waitForTimeout(2000);

    await page.locator('#first_name').fill('Hashani');
    await page.locator('#last_name').fill('Chamodi');
    await page.locator('#company').fill('ABC company');
    await page.locator('#address1').fill('Etobicoke');
    await page.locator('#address2').fill('2574 Islington Ave');

    await page.locator('#country').selectOption('Canada');
    await page.getByRole('textbox', {name:'state'}).fill('ON');
    await page.getByRole('textbox', {name:'city'}).fill('Etobicoke');
    await page.locator('#zipcode').fill('M9V2X2');
    await page.locator('#mobile_number').fill('647-970-2096');

    await page.getByRole('button', {name:'Create Account'}).click();
    


});
