import {test} from '@playwright/test';

test(`OrangeHRM Login test case`,async({page})=>{
    await page.goto('https://automation44-trials8101.orangehrmlive.com');
    let title = await page.title();
    console.log(`Title of the application is ${title}`);

    await page.locator(`#txtUsername`).fill('admin');

    const pwdLocator = await page.locator(`#txtPassword`);
    await pwdLocator.fill('Admin@123');

    await page.locator(`.icon.login-icon`).click();    

    await page.waitForLoadState('domcontentloaded');
    title = await page.title();
    console.log(`Title of the page after login is : ${title}`);

    let url = await page.url();
    console.log(`URL of the page is ${url}`);

    let content = await page.content();
    console.log(`URL of the page is ${content}`);

    await page.waitForTimeout(3000);
});