import {test} from '@playwright/test';

test(`Orange HRM Login testcase`, async ({browser})=>{
    test.setTimeout(180_000);
    const context = await browser.newContext();
    const page = await context.newPage();
    //await page.setDefaultTimeout(15_000);
    await page.setDefaultNavigationTimeout(30_000);

    await page.goto(`https://automation44-trials8101.orangehrmlive.com`);    

    const userNameLocator = await page.locator('#txtUsername');
    await userNameLocator.fill('admin');
    await page.locator('#txtPassword').fill(`Admin@123`);
    await page.locator('.icon.login-icon').click();
    await page.locator('.icon.login-icon').waitFor({state:`hidden`});

    await page.waitForLoadState(`domcontentloaded`);
    await page.waitForLoadState(`load`);
    //await page.waitForLoadState(`networkidle`);
    
    await page.waitForURL(`**/dashboard`);
    await page.locator(`#sidebar-profile-picture a.name`).waitFor({state:'visible'});
    let name = await page.locator(`#sidebar-profile-picture a.name`).innerText();
    console.log(name);

    
    
    

    //const message = await page.locator(`.remember-me-field`).textContent();
    //console.log(message?.trim().toUpperCase());
    
});