import {test} from '@playwright/test';

test("demo web shop register test case",async({browser}) =>{

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://demowebshop.tricentis.com/register');

    const firstname_locator = await page.locator('#FirstName');
    await firstname_locator.fill('sunanda');

    await page.locator('#LastName').fill('ivatury');

    await page.locator('#Email').fill('sunanda.ivatury7@gmail.com');

    await page.locator('#Password').fill('Value*123');
    await page.locator('#ConfirmPassword').fill('Value*123');

    await page.locator('#register-button').click();

    await page.waitForTimeout(3000);

    const loginemail = await page.locator('.account').textContent();
    console.log(loginemail);

    await page.locator('.ico-logout').click();


});