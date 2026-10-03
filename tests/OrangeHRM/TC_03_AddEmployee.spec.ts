import { test, expect } from '@playwright/test';

test('TC_03_AddEmployee - click Add Employee button', async ({ page }) => {
  test.setTimeout(180000);

  // 1. Open OrangeHRM login page
  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await expect(page.locator('.form-header')).toBeVisible({ timeout: 20000 });

  // 2. Login with valid credentials
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });

  // 3. Go to Employee Management page
  await page.locator('[data-automation-id="menu_pim_viewEmployeeList"]').first().click();
  await page.waitForURL(/.*pim.*employees/, { timeout: 30000 });

  // 4. Find Add Employee button and click it
  const addButton = page.locator('#addEmployeeButton');
  await expect(addButton).toBeVisible({ timeout: 30000 });
  await addButton.click();

  // 5. Stop here because this is the real working point in the live app
  console.log('Add Employee button clicked successfully.');
});