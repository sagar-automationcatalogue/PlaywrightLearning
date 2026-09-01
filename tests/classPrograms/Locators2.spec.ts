import {test} from '@playwright/test';

test('X path Learning for OrangeHRM application', async({page})=>{
    await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');

    //await page.getByPlaceholder('Username').fill('admin');
    await page.locator('xpath=/html/body/div[1]/div[1]/div[1]/div[2]/div[1]/form/div[1]/input').fill('admin');
    await page.locator('xpath=/html/body/div[1]/div[1]/div[1]/div[2]/div[1]/form/div[2]/input').fill('Admin@123');
    await page.locator(`xpath=/html/body/div[1]/div[1]/div[1]/div[2]/div[1]/form/div[4]/button`).click();

    await page.waitForLoadState('networkidle');
    //let message = await page.locator(`xpath=/html/body/div[1]/div[1]/div[1]/div[2]/section/div[3]/div[1]/div[1]/dashboard-layout/div[1]/widget-container/div[1]/div[3]/span/span/time-at-work-widget/div/div/div[2]/span/div/div/span[2]/div[2]`).textContent();
    let message = await page.locator(`.last-punched-out-container`).textContent();
    console.log(message);
    await page.waitForTimeout(4000);
})