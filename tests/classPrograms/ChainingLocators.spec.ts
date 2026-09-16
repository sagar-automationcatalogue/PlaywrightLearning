import {test} from '@playwright/test';

test('Playwright Chaining in-built Locators', async({browser}) =>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://automationexercise.com');
    //await page.getByText('Signup / Login').click();

    await page.getByRole('link', {name:'Signup / Login'}).click();
    await page.getByPlaceholder('Name').fill('Brahmam');    
    const signupForm = await page.locator('.signup-form');
    await signupForm.getByPlaceholder('Email Address').fill('Brahmam.test2@gmail.com');

    //await page.locator('.signup-form').getByPlaceholder('Email Address').fill('Brahmam.test@gmail.com');
    //await page.getByRole('button',{name:'Signup'}).click();
    await signupForm.getByRole('button',{name:'Signup'}).click();

    await page.getByLabel('Mr.').check();
    await page.getByLabel('Mrs.').check();
    await page.locator('//*[@id="password"]').fill('Admin@123');
    await page.waitForTimeout(2000);
    await page.locator('#days').selectOption('9');
    await page.locator('#months').selectOption('4');    
    await page.locator('#months').selectOption({label:'August'});
    await page.waitForTimeout(2000);
    await page.locator('#months').selectOption({value:'12'});
    await page.waitForTimeout(2000);
    await page.locator('#years').selectOption({index:5});
    await page.waitForTimeout(4000);
})