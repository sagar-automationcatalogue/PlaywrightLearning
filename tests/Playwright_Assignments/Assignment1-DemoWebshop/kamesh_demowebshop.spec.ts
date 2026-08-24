import { test } from '@playwright/test';

test('demowebshop login testcase', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://demowebshop.tricentis.com/');

    await page.locator('.ico-register').click();

    const userGenderLocator = page.locator('#gender-male');
    await page.locator('#gender-male').click();

    const userFirstNameLocator = page.locator('#FirstName');
    await userFirstNameLocator.fill('first');

    await page.waitForTimeout(2000);

    const userLastNameLocator = page.locator('#LastName');
    await userLastNameLocator.fill('automation');

    await page.waitForTimeout(2000);

    let userEmailLocator = page.locator('#Email');
    await userEmailLocator.fill('kamesh.test7@gmail.com');



    await page.locator('#Password').fill('Admin@123');
    await page.waitForTimeout(2000);

    await page.locator('#ConfirmPassword').fill('Admin@123');

    await page.locator('.button-1.register-next-step-button').click();

    await page.locator('.ico-logout').click();
    

    await page.locator('.ico-login').click();
    

    userEmailLocator = page.locator('#Email');
    await userEmailLocator.fill('kamesh.test7@gmail.com');

    await page.waitForTimeout(2000);

    await page.locator('#Password').fill('Admin@123');
    

    await page.locator('#RememberMe').click();
    

    await page.locator('.button-1.login-button').click();


    await page.locator('.ico-logout').click();
    await page.waitForTimeout(2000);

});