import {test} from '@Playwright/test';

test('Login',async({page})=>{
    await page.goto(' https://demowebshop.tricentis.com/');
    await page.locator('.ico-register').click();
    await page.locator('#gender-female').click();
    await page.locator('#FirstName').fill("Lavanya");
    await page.locator('#LastName').fill("M");
    await page.locator('#Email').fill("lavanya.dr9799447789@gmail.com");
    await page.locator('#Password').fill("lavanya1477");
    await page.locator('#ConfirmPassword').fill("lavanya1477");
    await page.locator('.button-1 register-next-step-button');
    await page.locator('#register-button').click();
    console.log("user Registered Successfully")
    //logout
    await page.locator('.ico-logout').click();
    //Login
    await page.locator('.ico-login').click();
    await page.locator('#Email').fill("lavanya.dr9799447789@gmail.com");
    await page.locator('#Password').fill("lavanya1477");
    await page.locator('#RememberMe').click();
    await page.locator('.button-1.login-button').click();
    console.log("Login successfully");
    const account = await page.locator('.account');
    const username = await account.textContent();
    console.log("Login successfully");
    console.log(username);
    });