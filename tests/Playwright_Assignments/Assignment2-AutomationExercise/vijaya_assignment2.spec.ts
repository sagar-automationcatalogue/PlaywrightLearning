import {test} from '@playwright/test'
test("automation excercise registration", async({page})=>
{
    await page.goto('https://www.automationexercise.com/');
    await page.getByRole('link', {name: 'Signup / Login'}).click();
    await page.getByPlaceholder('Name').fill('Vijaya');
    await page.locator('.signup-form').getByPlaceholder('Email Address').fill('durgi12345.vijaya@gmail.com');
    await page.locator('.signup-form').getByRole('button', {name:'Signup'}).click();
    await page.locator('.radio-inline').getByRole('radio', {name:'Mrs.'}).check();
    await page.locator('.required.form-group').locator('#password').fill('vijaya@123');
    await page.locator('#days').selectOption('2');
    await page.locator('#months').selectOption('February');
    await page.locator('#years').selectOption('1990');
    await page.getByRole('checkbox', {name:'Sign up for our newsletter!'}).check();
    await page.getByRole('checkbox', {name:'Receive special offers from our partners!'}).check();
    await page.locator('#first_name').fill('Vijaya')
    await page.locator('#last_name').fill('Durgi')
    await page.locator('#company').fill('Darkmatter')
    await page.locator('#address1').fill('Jublihills')
    await page.locator('#address2').fill('phoneix building')
    await page.locator('#country').selectOption('India');
    await page.getByRole('textbox', {name:'state'}).fill('Telangana');
    await page.getByRole('textbox', {name:'city'}).fill('Hyderabad');
    await page.locator('#zipcode').fill('500048')
    await page.locator('#mobile_number').fill('9908173733')
    await page.getByRole('button',{name:'Create Account'}).click();
    await page.waitForTimeout(2000);
})