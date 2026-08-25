import {test} from '@playwright/test';

test('Playwright Chaining in-built Locators', async({page}) =>{
    await page.goto('http://automationexercise.com');
  
    await page.getByRole('link', {name:'Signup / Login'}).click();
    await page.getByPlaceholder('Name').fill('Soujanya');
    const signupForm = await page.locator('.signup-form');
    await signupForm.getByPlaceholder('Email Address').fill('Soujanya.test4@gmail.com');
    await signupForm.getByRole('button',{name:'Signup'}).click();
    await page.getByLabel('Mr.').check();
    await page.locator('//*[@id="password"]').fill('Admin@123');
    await page.locator('#days').selectOption('6');
    await page.locator('#months').selectOption('8');
    await page.locator('#years').selectOption('2021');
    await page.getByLabel('Sign up for our newsletter!').check();
    await page.getByLabel('Receive special offers from our partners!').check();


    const addressInformation = await page.locator('.required.form-group');
    await addressInformation.getByRole('textbox',{name:'First name' }).fill('soujanya');
    await addressInformation.getByRole('textbox',{name:'Last name' }).fill('Naravaneni');
    await page.locator('#company').fill('Amazon');
    await page.locator('#address1').fill('123 Street');
    await addressInformation.getByRole('textbox',{name:'Address 2' }).fill('Vaudreuil');
    await addressInformation.getByRole('combobox',{name:'Country' }).selectOption('Canada');
    await addressInformation.getByRole('textbox',{name:'State' }).fill('QC');
    await page.locator('#city').fill('Montreal');
    await page.locator('#zipcode').fill('T6H 0R4');
    await page.waitForTimeout(4000);
    await addressInformation.getByRole('textbox',{name:'Mobile Number' }).fill('5234567895');
    await page.waitForTimeout(4000);
    await page.getByRole('button',{name:'Create Account' }).click();
    await page.waitForTimeout(4000);

})