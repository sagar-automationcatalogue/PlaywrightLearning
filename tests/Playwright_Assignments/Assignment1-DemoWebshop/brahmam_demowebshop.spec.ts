import { test, expect } from '@playwright/test';

test('open demo web shop', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://demowebshop.tricentis.com/');
    await page.locator("//a[@href='/login'][text()='Log in']").click();
    await page.waitForTimeout(3000);

    const userEmailLocator = await page.locator(`#Email`);
    await userEmailLocator.fill('sagar.automationcatalogue8@gmail.com');

    await page.waitForTimeout(3000);

    await page.locator(`Password`).fill('Admin@123');
    await page.waitForTimeout(3000);

    await page.locator('//label[text()="Remember me?"]').isVisible();
    await page.locator('//a[@href="/passwordrecovery"]').isVisible();
    await page.locator('//input[@class="button-1 login-button"]').isVisible();
});