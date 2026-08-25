import {test} from '@playwright/test';

test('Chaining Locators testcase1', async({page}) =>{
    
    await page.goto('https://www.automationexercise.com/');
    await page.getByRole('link',{name:'Signup / Login'}).click();
    await page.getByPlaceholder('Name').fill('Kamesh');
    const signupForm = await page.locator('.signup-form');
    await signupForm.getByPlaceholder('Email Address').fill('kamesh.test@gmail.com');
    await signupForm.getByRole('button',{name:'Signup'}).click();
    await page.getByLabel('Mr.').check();
    await page.locator('//*[@id="password"]').fill('Admin@123');
    await page.locator('#days').selectOption('1');
    await page.locator('#months').selectOption('1');
    await page.locator('#years').selectOption('1983');
    await page.getByLabel('Sign up for our newsletter!').click(); 
    await page.getByLabel('Receive special offers from our partners!').click();
    const addresinformatoin = page.locator(`.required.form-group`);
    await addresinformatoin.getByRole(`textbox`, {name: `First name `}).fill('Kamesh');
    await addresinformatoin.getByRole(`textbox`, {name: `Last name `}).fill('M');
    await page.locator(`#company`).fill(`TechM`);
    await page.locator('.inline-infos').fill('Khairatabad, Hyderabad');
    await page.locator('#country').selectOption('India');
    await addresinformatoin.getByRole(`textbox`, {name: `state `}).fill('Telangana');
    await addresinformatoin.getByRole(`textbox`, {name: `city `}).fill('Hyderabad');
    await page.locator('#zipcode').fill('500004');
    await addresinformatoin.getByRole(`textbox`, {name: `mobile number `}).fill('8904357271');
    await page.waitForTimeout(2000);
    await page.locator('//*[@id="form"]/div/div/div/div[1]/form/button').click();
    await page.waitForTimeout(2000);
    await page.locator(`//*[@id="form"]/div/div/div/div/a`).click();
    await page.getByRole(`link`,{name:` Logout `}).click();
    await page.waitForTimeout(4000);
})