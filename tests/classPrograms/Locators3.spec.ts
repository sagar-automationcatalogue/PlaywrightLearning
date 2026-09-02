import {test} from '@playwright/test';

test('X path with Attributes Learning for OrangeHRM application', async({page})=>{
    await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');

    //await page.getByPlaceholder('Username').fill('admin');
    await page.locator(`xpath=//input[@id='txtUsername']`).fill('admin');
    await page.locator(`xpath=//input[@name='txtPassword']`).fill('Admin@123');
    await page.locator(`xpath=//button[@type='submit']`).click();

    await page.waitForLoadState('networkidle');
    //let message = await page.locator(`xpath=//div[@class='last-punched-out-container']`).textContent();
    let message = await page.locator(`xpath=//div[@class='last-punched-out-container']`).innerText();
    //let message = await page.locator(`.last-punched-out-container`).textContent();
    console.log(message);
    await page.waitForTimeout(4000);
})