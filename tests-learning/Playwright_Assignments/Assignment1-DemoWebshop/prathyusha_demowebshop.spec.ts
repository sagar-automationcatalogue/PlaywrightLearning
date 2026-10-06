import {test} from '@playwright/test';

test('demo webshop testcase',async ({browser})=> {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://demowebshop.tricentis.com/');
    await page.locator('.ico-register').click();
    await page.locator('#gender-female').click();
    const FirstName = await page.locator('#FirstName').fill('prathyusha12');
    const LastName = await page.locator('#LastName').fill('tirunahari12');

    const Email = await page.locator('#Email').fill('tirunahari12345@gmail.com');
    const password = await page.locator('#Password').fill('tirunahari1234');
    const confirmpassword = await page.locator('#ConfirmPassword').fill('tirunahari1234');
    await page.locator('#register-button').click();
await page.locator('.ico-logout').click();


await page.locator('.ico-login').click();
 const Email1 = await page.locator('#Email').fill('tirunahari12345@gmail.com');
    const password1= await page.locator('#Password').fill('tirunahari1234');
    await page.locator('.button-1.login-button').click();
});
