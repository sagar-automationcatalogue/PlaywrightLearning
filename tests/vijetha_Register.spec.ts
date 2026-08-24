import {test} from '@playwright/test';

test('Register test case', async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`https://demowebshop.tricentis.com/`);

    await page.locator(`.ico-register`).click();
    await page.locator(`#gender-female`).click();
    await page.locator(`#FirstName`).fill(`vijetha`);
    await page.locator(`#LastName`).fill(`Test`);   
    await page.locator(`#Email`).fill(`vijetha.g20@gmail.com`);
    await page.locator(`#Password`).fill(`Test@123`);    
    await page.locator(`#ConfirmPassword`).fill(`Test@123`); 
    await page.locator(`#register-button`).click();
    await page.locator(`.button-1 register-continue-button`).click();

    await page.locator(`.ico-logout`).click();

    await page.locator(`.ico-login`).click();
    await page.locator(`#Email`).fill(`vijetha.g20@gmail.com`);
    await page.locator(`#Password`).fill(`Test@123`); 
    await page.locator(`#RememberMe`).click();
    await page.locator(`.button-1.login-button`).click();
})
