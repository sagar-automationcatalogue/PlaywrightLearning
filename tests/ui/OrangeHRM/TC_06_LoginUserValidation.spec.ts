import { test, expect, Page } from '@playwright/test';
/** Testcase developed by Vijaya - Need to figure out completed */
const BASE_URL = 'https://automation44-trials8101.orangehrmlive.com';

async function submitLogin(page: Page, username: string, password: string) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  //await expect(page.locator(`//div[@class='actions-container-outer-container']`)).toBeVisible()
}

async function login(page: Page, username: string, password: string) {
  await submitLogin(page, username, password);
  await expect(page).toHaveURL(/dashboard/);
}

async function logout(page: Page) {
  await page.getByText('Log Out').first().click();   // verify against your DOM
  await expect(page.getByPlaceholder('Username')).toBeVisible();
}

async function searchUser(page: Page, username: string) {
  await page.getByText('oxd_filter').click();
  await page.locator(`//input[@id='systemuser_uname_filter']`).fill(username);
  await page.locator('#status_inputfileddiv input.select-dropdown').click();
  await page.locator('#status_inputfileddiv ul.dropdown-content li span', { hasText: /^All$/ }).click();
  await expect(page.locator('#status_inputfileddiv input.select-dropdown')).toHaveValue('All');
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Search' }).click();
  const row = page.getByRole('row', { name: new RegExp(username, 'i') }).first();
  await expect(row).toBeVisible();
  return row;
}

async function setUserStatus(page: Page, username: string, status: 'Enabled' | 'Disabled') {
  const row = await searchUser(page, username);
  await page.locator(`//i[text()='ohrm_edit']`).first().click();
  //await row.locator('i.material-icons', { hasText: 'edit' }).first().click();
  await page.getByText(status, { exact: true }).click();
   await page.waitForTimeout(3000);
  await page.getByText('Save').click();
}

test('@regression TC_06_LoginUserValidation: Create System User → Disable → Login Validation → Re-enable', async ({ page, browser }) => {
  const newUsername = 'Test128'; // We need to update this username before we execute this test case 
  const newPassword = 'Test@12345678';

  // Step 1 - Admin login and create user
  await login(page, 'admin', 'Admin@123');
  await page.locator(`//span[text()='HR Administration']`).first().click();
  await expect(page.locator('.highlight.bordered')).toBeVisible();
  await page.locator(`//i[text()='add']`).click();

  await page.locator('#selectedEmployee_value').click();
  await page.locator('#selectedEmployee_value').pressSequentially('aar', { delay: 150 });
  const suggestion = page.locator('.angucomplete-row').filter({ hasText: 'Aaron Hamilton' });
  await expect(suggestion).toBeVisible();
  await suggestion.click();

  await page.locator('#user_name').fill(newUsername);
  await page.locator('div[name="essrole"]').click();
  await page.getByRole('option', { name: 'Default ESS' }).click();
  await page.locator('div[name="supervisorrole"]').click();
  await page.getByRole('option', { name: 'Default Supervisor' }).click();
  await page.locator('div[name="adminrole"]').click();
  await page.getByRole('option', { name: 'Report Admin' }).click();
  await page.getByPlaceholder('Enter Password').fill(newPassword);
  await page.getByPlaceholder('Confirm Password').fill(newPassword);
  await expect(page.locator('#modal-save-button')).toBeEnabled();
  await page.waitForTimeout(3000);
await page.locator('#modal-save-button').click();
await page.locator('#modal-save-button').click();

const closeBtn = page.locator('button.btn.btn-close');
if (await closeBtn.isVisible()) {
  await closeBtn.click();
}
  
 /*let User_successful=await page.locator(`//div[@class='toast-message']`).innerText();
  await expect(User_successful).toBe('Successfully Saved')
  await expect(page.locator(`//button[@class='btn btn-close']`)).toBeVisible();
  await page.locator(`//button[@class='btn.btn-close']`).click(); */

  // Step 2 - New user logs in (fresh context), then logs out
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await login(userPage, newUsername, newPassword);
  console.log('New user logged in successfully');
  await logout(userPage);
  await userContext.close();

  // Step 3 - Admin disables the new user
  // (the admin session in `page` is still alive, so no re-login is needed)
  await setUserStatus(page, newUsername, 'Disabled');
  console.log('User disabled');

  // Step 4 - Disabled user tries to log in (fresh context) - must fail
  const disabledContext = await browser.newContext();
  const disabledPage = await disabledContext.newPage();
  await submitLogin(disabledPage, newUsername, newPassword);
  await expect(disabledPage).not.toHaveURL(/dashboard/);
  await expect(disabledPage.getByText(/disabled|invalid/i)).toBeVisible(); // adjust to real error text
  console.log('Disabled user could not log in');
  await disabledContext.close();

  // Step 5 - Admin re-enables the user
  await setUserStatus(page, newUsername, 'Enabled');

  // Step 6 - User logs in again (fresh context)
  const reContext = await browser.newContext();
  const rePage = await reContext.newPage();
  await login(rePage, newUsername, newPassword);
  console.log('Re-enabled user logged in successfully');
  await reContext.close();
});