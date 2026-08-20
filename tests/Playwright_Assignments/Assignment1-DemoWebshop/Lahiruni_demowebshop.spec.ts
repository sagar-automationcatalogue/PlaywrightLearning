import { test, expect } from '@playwright/test';

test('login test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://demowebshop.tricentis.com/');

    
    const email = 'Anna.smith@example.com';
    const password = 'Password123';

   
    await page.locator('.ico-register').click();
    await page.locator('#gender-female').click();
    await page.locator('#FirstName').fill('Anna');
    await page.locator('#LastName').fill('smith');
    await page.locator('#Email').fill(email);
    await page.locator('#Password').fill(password);
    await page.locator('#ConfirmPassword').fill(password);
    await page.locator('#register-button').click();
        
    await page.locator(`.button-1 register-continue-button`).click();

    await page.locator(`.ico-logout`).click();
    

    await page.locator('.ico-login').click();

    await page.locator('#Email').fill(email);
    await page.locator('#Password').fill(password);
    await page.locator('#RememberMe').click();
    await page.locator('.button-1.login-button').click();

   
    
});


