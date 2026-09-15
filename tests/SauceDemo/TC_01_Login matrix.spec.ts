import {expect,test} from '@playwright/test';

test(`TC_01_Login matrix: Data-Driven Login Matrix:Empty->Invalid->Locked Out->Standard User`, async({page}) =>{
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
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    console.log('Required field validation is triggered');
    await page.waitForTimeout(2000);

    await page.reload();
    await expect(page.locator('#user-name')).toHaveText('');
    await (page.getByLabel('Password').nth(0)).fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    console.log('Empty username is rejected');

    await page.locator('xpath=//button[@class="error-button"]').click();
    console.log("Error UI can be reset");

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill('standard_user');
    await expect(page.locator('xpath=//input[@id="user-name"]')).toHaveValue('standard_user');
    console.log('Only username is populated')

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill('Test12345');
    await page.locator('xpath=//input[@id="password"]').fill('');
    await page.locator('xpath=//input[@id="login-button"]').click();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText('Epic sadface: Password is required');
    console.log('Second negative login is submitted');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill('standard_user');
    await page.locator('xpath=//input[@id="password"]').fill('');
    await page.locator('xpath=//input[@id="login-button"]').click();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText('Epic sadface: Password is required');
    console.log('Empty Password is rejected');

    await page.locator('xpath=//input[@id="user-name"]').clear();
    await expect(page.locator('xpath=//input[@id="user-name"]')).toHaveValue('');
    await page.locator('xpath=//input[@id="password"]').clear();
    await expect(page.locator('xpath=//input[@id="password"]')).toHaveValue('');
    console.log('Inputs return to baseline');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill('Test12345');
    await page.locator('xpath=//input[@id="password"]').fill('123456');
    await page.locator('xpath=//input[@id="login-button"]').click();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
    console.log('Invalid credentials are populated');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill('locked_out_user');
    await expect(page.locator('xpath=//input[@id="user-name"]')).toHaveValue('locked_out_user');
    await page.locator('xpath=//input[@id="password"]').fill('secret_sauce');
    await expect(page.locator('xpath=//input[@id="password"]')).toHaveValue('secret_sauce');
    console.log('Locked Persona credentials are populated');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill('locked_out_user');
    await page.locator('xpath=//input[@id="password"]').fill('secret_sauce');
    await page.locator('xpath=//input[@id="login-button"]').click();
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    console.log('Locked user authentication is attempted');

    await page.locator('xpath=//input[@id="user-name"]').clear();
    await expect(page.locator('xpath=//input[@id="user-name"]')).toHaveValue('');
    await page.locator('xpath=//input[@id="password"]').clear();
    await expect(page.locator('xpath=//input[@id="password"]')).toHaveValue('');
    console.log('Locked account behavior is correct');

    await page.reload();
    await page.locator('xpath=//input[@id="user-name"]').fill('standard_user');
    await page.locator('xpath=//input[@id="password"]').fill('secret_sauce');
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
    await expect(page.locator('xpath=//h3[@data-test="error"]')).toHaveText("Epic sadface: You can only access '/inventory.html' when you are logged in.");
    console.log("Logged out state remains effective"); 
















})
