import {test} from'@playwright/test';

test('Playwright basic test automation', async({browser})=>{
    let context = await browser.newContext();
    let page = await context.newPage();

    await page.goto('https://automation44-trials8101.orangehrmlive.com');
    await page.locator('#txtUsername').fill('sagar_automation');

    await page.waitForTimeout(3000);
});

test('Playwright basic test automation-2', async({page})=>{   

    await page.goto('https://automation44-trials8101.orangehrmlive.com');
    await page.locator('#txtUsername').fill('mani_automation');

    await page.waitForTimeout(3000);
});