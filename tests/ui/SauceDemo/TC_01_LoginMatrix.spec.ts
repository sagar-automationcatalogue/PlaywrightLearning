import {expect,test} from '@playwright/test';
import { TC_01_LoginMatrix } from '../../../test-data/sauceDemo.ts';

/** Testcase developed by Sunanda - Completed */
test(`@smoke TC_01_Login matrix: Data-Driven Login Matrix:Empty->Invalid->Locked Out->Standard User`, async({page}) =>{
    await page.goto(`https://www.saucedemo.com/`);

    console.log('Login page is displayed');

    await page.reload();
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.getByLabel('Password').nth(0)).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();
    console.log('Login form is usable');

    await expect(page.getByLabel('Password').nth(0)).toHaveAttribute('type','password');
    console.log('Password control has password semantics');

    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toHaveText(TC_01_LoginMatrix.errors.usernameRequired);
    console.log('Required field validation is triggered');
    await page.waitForTimeout(2000);

    await page.reload();
    await expect(page.locator('#user-name')).toHaveText('');
    await (page.getByLabel('Password').nth(0)).fill(TC_01_LoginMatrix.validPassword);
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toHaveText(TC_01_LoginMatrix.errors.usernameRequired);
    console.log('Empty username is rejected');

    await page.locator('xpath=//button[@class="error-button"]').click();
    console.log("Error UI can be reset");

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill(TC_01_LoginMatrix.standardUsername);
    await expect(page.locator('xpath=//input[@id="user-name"]')).toHaveValue(TC_01_LoginMatrix.standardUsername);
    console.log('Only username is populated')

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill(TC_01_LoginMatrix.invalidUsername);
    await page.locator('xpath=//input[@id="password"]').fill(TC_01_LoginMatrix.emptyValue);
    await page.locator('xpath=//input[@id="login-button"]').click();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText(TC_01_LoginMatrix.errors.passwordRequired);
    console.log('Second negative login is submitted');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill(TC_01_LoginMatrix.standardUsername);
    await page.locator('xpath=//input[@id="password"]').fill(TC_01_LoginMatrix.emptyValue);
    await page.locator('xpath=//input[@id="login-button"]').click();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText(TC_01_LoginMatrix.errors.passwordRequired);
    console.log('Empty Password is rejected');

    await page.locator('xpath=//input[@id="user-name"]').clear();
    await expect(page.locator('xpath=//input[@id="user-name"]')).toHaveValue(TC_01_LoginMatrix.emptyValue);
    await page.locator('xpath=//input[@id="password"]').clear();
    await expect(page.locator('xpath=//input[@id="password"]')).toHaveValue(TC_01_LoginMatrix.emptyValue);
    console.log('Inputs return to baseline');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill(TC_01_LoginMatrix.invalidUsername);
    await page.locator('xpath=//input[@id="password"]').fill(TC_01_LoginMatrix.invalidPassword);
    await page.locator('xpath=//input[@id="login-button"]').click();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText(TC_01_LoginMatrix.errors.invalidCredentials);
    console.log('Invalid credentials are populated');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill(TC_01_LoginMatrix.lockedOutUsername);
    await expect(page.locator('xpath=//input[@id="user-name"]')).toHaveValue(TC_01_LoginMatrix.lockedOutUsername);
    await page.locator('xpath=//input[@id="password"]').fill(TC_01_LoginMatrix.validPassword);
    await expect(page.locator('xpath=//input[@id="password"]')).toHaveValue(TC_01_LoginMatrix.validPassword);
    console.log('Locked Persona credentials are populated');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill(TC_01_LoginMatrix.lockedOutUsername);
    await page.locator('xpath=//input[@id="password"]').fill(TC_01_LoginMatrix.validPassword);
    await page.locator('xpath=//input[@id="login-button"]').click();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText(TC_01_LoginMatrix.errors.lockedOut);
    console.log('Locked user authentication is attempted');

    await page.locator('xpath=//input[@id="user-name"]').clear();
    await expect(page.locator('xpath=//input[@id="user-name"]')).toHaveValue(TC_01_LoginMatrix.emptyValue);
    await page.locator('xpath=//input[@id="password"]').clear();
    await expect(page.locator('xpath=//input[@id="password"]')).toHaveValue(TC_01_LoginMatrix.emptyValue);
    console.log('Locked account behavior is correct');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill(TC_01_LoginMatrix.standardUsername);
    await page.locator('xpath=//input[@id="password"]').fill(TC_01_LoginMatrix.validPassword);
    await page.locator('xpath=//input[@id="login-button"]').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    console.log("user is redirected to inventory");
    await expect(page.locator('xpath=//span[text()="Products"]')).toBeVisible();
    await expect(page.locator('//button[@id="react-burger-menu-btn"]')).toBeVisible();
    await expect(page.locator('//a[@class="shopping_cart_link"]')).toBeVisible();
    console.log("Authenticated application shell is present");
    await page.waitForTimeout(2000);

    await page.locator('//button[@id="react-burger-menu-btn"]').click();
    await page.locator('//a[@id="logout_sidebar_link"]').click();
    console.log("Session is ended");
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    console.log("Logout succeeds");

    await page.goBack();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText(TC_01_LoginMatrix.errors.protectedRoute);
    console.log("Logged out state remains effective"); 
















})
