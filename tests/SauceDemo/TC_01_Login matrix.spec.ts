import {expect,test} from '@playwright/test';

test(`TC_01_Login matrix: Data-Driven Login Matrix:Empty->Invalid->Locked Out->Standard User`, async({page}) =>{
    await page.goto(`https://www.saucedemo.com/`);

    console.log('Login page is displayed');

    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.getByLabel('Password').nth(0)).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();
    console.log('Login form is usable');

    await expect(page.getByLabel('Password').nth(0)).toHaveAttribute('type','password');
    console.log('Password control has password semantics');

    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    console.log('Required field validation is triggered');
    await page.waitForTimeout(2000);

    await page.reload();
    await expect(page.locator('#user-name')).toHaveText('');
    await (page.getByLabel('Password').nth(0)).fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    console.log('Empty username is rejected');








})
