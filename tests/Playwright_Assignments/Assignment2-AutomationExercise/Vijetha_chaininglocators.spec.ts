import {test} from '@playwright/test';

test("automation excercise registration", async({page})=>{
    await page.goto('https://www.automationexercise.com/');
    await page.waitForTimeout(3000);
    await page.getByText('Signup / Login').click();
    await page.getByPlaceholder('Name').fill('Vijetha');
await page.locator('.signup-form').getByPlaceholder('Email Address').fill('vijetha.god22@gmail.com');
    await page.locator('.signup-form').getByRole('button', { name: 'Signup' }).click();
     await page.waitForTimeout(3000);

    await page.getByLabel('Mrs.').check();
    await page.locator('.required.form-group').locator('#password').fill('Admin@123');
    await page.locator('#days').selectOption('2');
    await page.locator('#months').selectOption('July');
    await page.locator('#years').selectOption('1990');
    await page.getByRole('checkbox', {name:'Sign up for our newsletter!'}).check();
    await page.getByRole('checkbox', {name:'Receive special offers from our partners!'}).check();
    await page.locator('#first_name').fill('Vijetha');
    await page.locator('#last_name').fill('Testing');
    await page.locator('#company').fill('INTEL');
    await page.locator('#address1').fill('Etobicoke');
    await page.locator('#address2').fill('1410 Mabelle Cres');
    await page.locator('#country').selectOption('Canada');
    await page.getByRole('textbox', {name:'state'}).fill('NA');
    await page.getByRole('textbox', {name:'city'}).fill('Etobicoke');
    await page.locator('#zipcode').fill('M9A5U1');
    await page.locator('#mobile_number').fill('4369856622');
    await page.getByRole('button',{name:'Create Account'}).click();
    await page.waitForTimeout(3000);
})