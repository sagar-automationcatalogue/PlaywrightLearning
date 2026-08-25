import {test} from '@playwright/test';

test(`Playwright in-built locators`, async({page}) =>{
    await page.goto("https://practicesoftwaretesting.com/");
    //await page.locator(".nav-link").click();
    await page.getByText("Sign in").click();

    await page.getByPlaceholder("Your email").fill("sagar.automationcatalogue8@gmail.com");
    //await page.locator("#email").fill("sagar.automationcatalogue8@gmail.com")
    await page.getByLabel("Password *").fill('Practiceadmin@123');
    await page.getByRole("button", {name:'Login'}).click();
    //await page.locator('.btnSubmit').click();

    await page.waitForTimeout(6000);
});