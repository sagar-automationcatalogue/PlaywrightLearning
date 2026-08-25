import {test} from '@playwright/test';

test('Playwright Chaining in-built Locators', async({page}) =>{
    await page.goto('http://automationexercise.com');
    //await page.getByText('Signup / Login').click();

    await page.getByRole('link', {name:'Signup / Login'}).click();
    await page.getByPlaceholder('Name').fill('Brahmam');
    //await page.getByPlaceholder('Email Address').nth(2).fill('Brahmam.test@gmail.com');
    const signupForm = await page.locator('.signup-form');
    await signupForm.getByPlaceholder('Email Address').fill('Brahmam.test2@gmail.com');

    //await page.locator('.signup-form').getByPlaceholder('Email Address').fill('Brahmam.test@gmail.com');
    //await page.getByRole('button',{name:'Signup'}).click();
    await signupForm.getByRole('button',{name:'Signup'}).click();

    await page.getByLabel('Mr.').check();
    await page.locator('//*[@id="password"]').fill('Admin@123');

    await page.locator('#days').selectOption('6');

    await page.waitForTimeout(4000);
})