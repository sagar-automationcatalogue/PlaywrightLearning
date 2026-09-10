import {expect, test} from '@playwright/test'

test(`CSS Selectors and Playwright Assertions`, async({page}) =>{

    await page.goto('https://automation44-trials8101.orangehrmlive.com/');
    await page.locator(`#txtUsername`).fill(`admin`);
    await page.locator(`.password-input`).fill(`Admin@123`);
    await page.locator(`button[type='submit']`).click();

    await expect.soft(page).toHaveURL('https://automation44-trials8101.orangehrmlive.com/client/#/dashboard');
    //await page.locator(`span[class='menu-title-text tooltipped'][data-tooltip='Leave']`).first().click();

    const profileName_locator = await page.locator(`#sidebar-profile-picture>a`);
    await expect.soft(profileName_locator).toContainText("Vijetha");

    const logout_locator = await page.locator(`li[id='navbar-logout'] a span`);
    await expect.soft(logout_locator).toBeVisible();
    await page.locator(`span[class='menu-title-text tooltipped'][data-tooltip='Leave']`).first().click();

    await page.waitForTimeout(4000);

})