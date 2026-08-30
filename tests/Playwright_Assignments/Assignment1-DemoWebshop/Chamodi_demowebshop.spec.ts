import {test} from "@playwright/test";

test("Demo webshop Login Testcase", async ({ browser }) => {
    const context = await browser.newContext(); //Creating a new context in the browser
    const page = await context.newPage(); //Create a new page in the context
    await page.goto("https://demowebshop.tricentis.com/");

    await page.locator(".ico-register").click(); //create register and click
    
    await page.locator("#gender-female").click(); //select gender
    await page.waitForTimeout(2000);
    await page.locator("#FirstName").fill("Hashani"); //Fill first name
    await page.waitForTimeout(2000);
    await page.locator("#LastName").fill("Chamodi"); //Fill last name
    await page.waitForTimeout(2000);
    await page.locator("#Email").fill("hashani123456@test.com"); //Fill email
    await page.waitForTimeout(2000);

    await page.locator("#Password").fill("Hashani1234"); //Fill password
    await page.waitForTimeout(2000);
    await page.locator("#ConfirmPassword").fill("Hashani1234");
    await page.waitForTimeout(2000);

    await page.locator("#register-button").click(); //Click on register button
    await page.waitForTimeout(2000);

    await page.locator(".ico-logout").click();
    await page.waitForTimeout(2000);

    await page.locator(".ico-login").click();

    await page.locator("#Email").fill("hashani123456@test.com");
    await page.waitForTimeout(2000);
    await page.locator("#Password").fill("Hashani1234");
    await page.waitForTimeout(2000);

    await page.locator(".button-1.login-button").click();




});