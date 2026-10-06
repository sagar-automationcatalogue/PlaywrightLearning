import {test} from '@playwright/test';

test('Playwright Basics Test Automation-3',async({page})=>{
    await page.goto(`https://automation44-trials8101.orangehrmlive.com`);
    await page.waitForTimeout(15000);
    await page.goto(`https://www.google.com`);
    await page.waitForTimeout(20000);
    await page.goBack();
    await page.waitForTimeout(2000);
    await page.goForward();
    await page.waitForTimeout(2000);
})