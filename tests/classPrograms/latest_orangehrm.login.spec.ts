import {test} from '@playwright/test';

test(`Orange HRM Login testcase`, async ({browser})=>{
    test.setTimeout(180_000);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`https://automation44-trials8101.orangehrmlive.com`);

    await page.waitForTimeout(3_000);

    const userNameLocator = await page.locator('#txtUsername');
    await userNameLocator.fill('admin');

    await page.waitForTimeout(3_000);

    await page.locator('#txtPassword').fill(`Admin@123`);
    //await page.waitForTimeout(30_000);

    await page.locator('.icon.login-icon').click();
    //await page.waitForTimeout(5000);
    

    //const message = await page.locator(`.remember-me-field`).textContent();
    //console.log(message?.trim().toUpperCase());
    
});