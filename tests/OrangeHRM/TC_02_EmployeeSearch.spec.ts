import { test, expect } from '@playwright/test';

test('Verify Application URL package dropdown', async ({ page }) => {

await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
await page.getByPlaceholder('Username').fill('admin');
await page.getByPlaceholder('Password').fill('Admin@123');
await page.getByRole('button',{name:'Login'}).click();

await page.locator('span').filter({ hasText: 'Employee Management' }).first()

await page.getByRole('link', { name: 'Employee List' }).click();

await page.locator('#row.col.s12.list-container').isVisible();

await page.waitForTimeout(1000);

});