import { test } from '@playwright/test';

test('Playwright Chaining in-built Locators', async ({ page }) => {
    await page.goto('http://automationexercise.com');

    await page.getByRole('link', {name: 'Signup / Login'}).click();
    await page.getByPlaceholder('Name').fill('sunanda');

    const signupForm = await page.locator('.signup-form');
    await signupForm.getByPlaceholder('Email Address').fill('sunanda.ivatury@gmail.com');
    await signupForm.getByRole('button',{name:'Signup'}).click();
    await page.waitForTimeout(2000);
    await page.locator('#id_gender2').click();
    await page.locator('#password').fill('12345678');
    await page.locator('#days').selectOption('8');
    await page.locator('#months').selectOption('August');
    await page.locator('#years').selectOption('2000');
    await page.getByLabel('Sign up for our newsletter!').click();
    await page.getByLabel('Receive special offers from our partners!').click();

    await page.locator('#first_name').fill('sunanda');
    await page.locator('#last_name').fill('Ivatury');
    await page.locator('#address1').fill('C1401, Vazhraa Prathik');
    await page.locator('#country').selectOption('India');
    await page.locator('#state').fill('Telangana');
    await page.locator('#city').fill('Hyderabad');
    await page.locator('#zipcode').fill('500090');
    await page.locator('#mobile_number').fill('7032806080');
    await page.waitForTimeout(2000);

    await page.getByRole('button', {name:'Create Account'});

    await page.waitForTimeout(3000);




});