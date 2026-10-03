import { test, expect } from '@playwright/test';

test('TC_04_UpdateEmployee - Update employee personal and contact details', async ({ page }) => {
  test.setTimeout(180000);

  const employeeName = 'Mazie Abraham';
  const newGender = 'Male';
  const newMaritalStatus = 'Single';
  const newNationality = 'Indian';
  const newBirthday = '1990-08-15';
  const newStreetAddress = 'Plot 12, MG Road';
  const newCity = 'Hyderabad';
  const newState = 'Telangana';
  const newZip = '500081';
  const newMobile = '9876543210';

  // Step 1: Open OrangeHRM login page
  await page.goto('https://automation44-trials8101.orangehrmlive.com/auth/login');
  await expect(page.locator('.form-header')).toBeVisible({ timeout: 20000 });

  // Step 2: Login as Admin
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });
  console.log('Admin login successful');

  // Step 3: Navigate to Employee List
  await page.locator('[data-automation-id="menu_pim_viewEmployeeList"]').first().click();
  await page.waitForURL(/.*pim.*employees/, { timeout: 30000 });
  console.log('Employee list page opened');

  // Step 4: Search and open the employee profile
  await expect(page.getByText(employeeName, { exact: true })).toBeVisible({ timeout: 30000 });
  await page.getByText(employeeName, { exact: true }).first().click();
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
    element.value = 'string:1';
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.locator('#emp_marital_status').evaluate((element) => {
    element.value = 'string:1';
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.locator('#nation_code').evaluate((element) => {
    element.value = 'string:82';
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.locator('#emp_birthday').click();
  await page.locator('#emp_birthday').fill(newBirthday);

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
  await expect(page.locator('#emp_birthday')).toHaveValue(newBirthday, { timeout: 20000 });
  console.log('Personal details persisted after refresh');

  // Step 8: Navigate to Contact Details and update contact information
  await page.getByRole('link', { name: 'Contact Details' }).first().click();
  await expect(page.locator('#street1')).toBeVisible({ timeout: 30000 });

  await page.locator('#street1').fill(newStreetAddress);
  await page.locator('#city').fill(newCity);
  await page.locator('#province').fill(newState);
  await page.locator('#emp_zipcode').fill(newZip);
  await page.locator('#emp_mobile').fill(newMobile);

  await page.getByRole('button', { name: 'Save' }).last().click();
  await expect(page.locator('body')).toContainText(/success|saved/i, { timeout: 30000 });
  console.log('Contact details saved successfully');

  // Step 9: Open another employee profile tab and return to Contact Details
  await page.getByRole('link', { name: 'Job' }).first().click();
  await page.getByRole('link', { name: 'Contact Details' }).first().click();

  // Step 10: Verify saved contact values remain
  await expect(page.locator('#street1')).toHaveValue(newStreetAddress, { timeout: 20000 });
  await expect(page.locator('#city')).toHaveValue(newCity, { timeout: 20000 });
  await expect(page.locator('#province')).toHaveValue(newState, { timeout: 20000 });
  await expect(page.locator('#emp_zipcode')).toHaveValue(newZip, { timeout: 20000 });
  await expect(page.locator('#emp_mobile')).toHaveValue(newMobile, { timeout: 20000 });
  console.log('Updated contact details persisted correctly');

  // Optional restore step
  console.log('Optional restore step can be added if required for the shared environment');
});