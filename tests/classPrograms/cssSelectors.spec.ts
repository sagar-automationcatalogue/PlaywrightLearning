import {expect, test} from '@playwright/test'

test(`CSS Selectors and Playwright Assertions`, async({page}) =>{

    await page.goto('https://automation44-trials8101.orangehrmlive.com/');
    await page.locator(`#txtUsername`).fill(`admin`);
    await page.locator(`.password-input`).fill(`Admin@123`);
    await page.locator(`button[type='submit']`).click();

    await expect.soft(page).toHaveURL('dashboard');
    await page.locator(`span[class='menu-title-text tooltipped'][data-tooltip='Leave']`).first().click();
    await page.waitForTimeout(4000);

})