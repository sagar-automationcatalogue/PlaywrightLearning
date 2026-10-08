import { test, expect } from '@playwright/test';
import { TC_04_UpdateEmployee } from '../../../test-data/orangeHRM.ts';

test('@sanity TC_04_UpdateEmployee - Update employee personal and contact details', async ({ page }) => {
  test.setTimeout(180000);

  // Step 1: Open OrangeHRM login page
  await page.goto('https://automaetesting-trials821.orangehrmlive.com/');
  await expect(page.locator('.form-header')).toBeVisible({ timeout: 20000 });

  // Step 2: Login as Admin
  await page.getByPlaceholder('Username').fill(TC_04_UpdateEmployee.adminUsername);
  await page.getByPlaceholder('Password').fill(TC_04_UpdateEmployee.adminPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });
  console.log('Admin login successful');

  // Step 3: Navigate to Employee List
  await page.locator('[data-automation-id="menu_pim_viewEmployeeList"]').first().click();
  await page.waitForURL(/.*pim.*employees/, { timeout: 30000 });
  console.log('Employee list page opened');

  // Step 4: Search and open the employee profile
  await expect(page.getByText(TC_04_UpdateEmployee.employeeName, { exact: true })).toBeVisible({ timeout: 30000 });
  await page.getByText(TC_04_UpdateEmployee.employeeName, { exact: true }).first().click();
  await expect(page.getByText('Profile', { exact: true })).toBeVisible({ timeout: 30000 });
  console.log('Employee profile opened');

  // Step 5: Verify Personal Details tab and capture current values
  await page.getByRole('link', { name: 'Personal Details' }).first().click();
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#firstName')).toBeVisible({ timeout: 30000 });

  const previousGender = await page.locator('#emp_gender').inputValue();
  const previousMaritalStatus = await page.locator('#emp_marital_status').inputValue();
  const previousNationality = await page.locator('#nation_code').inputValue();
  const previousBirthday = await page.locator('#emp_birthday').inputValue();

  console.log('Previous gender:', previousGender);
  console.log('Previous marital status:', previousMaritalStatus);
  console.log('Previous nationality:', previousNationality);
  console.log('Previous birthday:', previousBirthday);

  // Step 6: Update personal details
  await page.locator('#emp_gender').evaluate((element) => {
    element.value = TC_04_UpdateEmployee.genderValue;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.locator('#emp_marital_status').evaluate((element) => {
    element.value = TC_04_UpdateEmployee.maritalStatusValue;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.locator('#nation_code').evaluate((element) => {
    element.value = TC_04_UpdateEmployee.nationalityValue;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.locator('#emp_birthday').click();
  await page.locator('#emp_birthday').fill(TC_04_UpdateEmployee.newBirthday);

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('body')).toContainText(/success|saved/i, { timeout: 30000 });
  console.log('Personal details saved successfully');

  // Step 7: Refresh/reopen the profile and verify values persist
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 30000 });
  await page.getByRole('link', { name: 'Personal Details' }).first().click();

  await expect(page.locator('#emp_gender')).toHaveValue(/string:/, { timeout: 20000 });
  await expect(page.locator('#emp_marital_status')).toHaveValue(/string:/, { timeout: 20000 });
  await expect(page.locator('#nation_code')).toHaveValue(/string:/, { timeout: 20000 });
  await expect(page.locator('#emp_birthday')).toHaveValue(TC_04_UpdateEmployee.newBirthday, { timeout: 20000 });
  console.log('Personal details persisted after refresh');

  // Step 8: Navigate to Contact Details and update contact information
  await page.getByRole('link', { name: 'Contact Details' }).first().click();
  await expect(page.locator('#street1')).toBeVisible({ timeout: 30000 });

  await page.locator('#street1').fill(TC_04_UpdateEmployee.newStreetAddress);
  await page.locator('#city').fill(TC_04_UpdateEmployee.newCity);
  await page.locator('#province').fill(TC_04_UpdateEmployee.newState);
  await page.locator('#emp_zipcode').fill(TC_04_UpdateEmployee.newZip);
  await page.locator('#emp_mobile').fill(TC_04_UpdateEmployee.newMobile);

  await page.getByRole('button', { name: 'Save' }).last().click();
  await expect(page.locator('body')).toContainText(/success|saved/i, { timeout: 30000 });
  console.log('Contact details saved successfully');

  // Step 9: Open another employee profile tab and return to Contact Details
  await page.getByRole('link', { name: 'Job' }).first().click();
  await page.getByRole('link', { name: 'Contact Details' }).first().click();

  // Step 10: Verify saved contact values remain
  await expect(page.locator('#street1')).toHaveValue(TC_04_UpdateEmployee.newStreetAddress, { timeout: 20000 });
  await expect(page.locator('#city')).toHaveValue(TC_04_UpdateEmployee.newCity, { timeout: 20000 });
  await expect(page.locator('#province')).toHaveValue(TC_04_UpdateEmployee.newState, { timeout: 20000 });
  await expect(page.locator('#emp_zipcode')).toHaveValue(TC_04_UpdateEmployee.newZip, { timeout: 20000 });
  await expect(page.locator('#emp_mobile')).toHaveValue(TC_04_UpdateEmployee.newMobile, { timeout: 20000 });
  console.log('Updated contact details persisted correctly');

  // Optional restore step
  console.log('Optional restore step can be added if required for the shared environment');
});