import { expect, test } from '@playwright/test';
import { TC_01_LoginOrangeHrm } from '../../../test-data/orangeHRM.ts';

test('@smoke TC_01_LoginOrangeHrm: Login → Valid Login → Dashboard → Logout', async ({ page }) => {
    console.log('Step 1: Open the OrangeHRM login page');
    await page.goto('https://automaetesting-trials821.orangehrmlive.com/', { waitUntil: 'domcontentloaded' });

    const username = page.getByRole('textbox', { name: /Username/i });
    const password = page.getByRole('textbox', { name: /Password/i });
    const loginButton = page.getByRole('button', { name: 'Login' });

    console.log('Step 2: Verify the login page and its controls');
    await expect(page.locator('.form-header')).toBeVisible();
    await expect(username).toBeVisible();
    await expect(username).toBeEnabled();
    await expect(password).toBeVisible();
    await expect(password).toBeEnabled();
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    console.log('Step 3: Submit an invalid password');
    await username.fill(TC_01_LoginOrangeHrm.username);
    await expect(username).toHaveValue(TC_01_LoginOrangeHrm.username);
    await password.fill(TC_01_LoginOrangeHrm.invalidPassword);
    await expect(password).toHaveValue(TC_01_LoginOrangeHrm.invalidPassword);
    await loginButton.click({ noWaitAfter: true });

    const errorMessage = page.locator('.toast-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(TC_01_LoginOrangeHrm.invalidCredentialsPattern);
    await expect(page).toHaveURL(/securityAuthentication\/retryLogin/i);
    await expect(loginButton).toBeVisible();
    await expect(page.getByText(TC_01_LoginOrangeHrm.dashboardText, { exact: true })).toHaveCount(0);
    console.log('Invalid credentials were rejected; the login page remains visible');

    console.log('Step 4: Clear the fields and log in with valid credentials');
    await expect(username).toHaveValue(TC_01_LoginOrangeHrm.emptyValue);
    await expect(password).toHaveValue(TC_01_LoginOrangeHrm.emptyValue);

    await username.fill(TC_01_LoginOrangeHrm.username);
    await expect(username).toHaveValue(TC_01_LoginOrangeHrm.username);
    await password.fill(TC_01_LoginOrangeHrm.validPassword);
    await expect(password).toHaveValue(TC_01_LoginOrangeHrm.validPassword);
    await loginButton.click({ noWaitAfter: true });

    await expect(page).toHaveURL(/dashboard/i);
    await expect(page.getByText(TC_01_LoginOrangeHrm.dashboardText, { exact: true }).first()).toBeVisible();
    console.log('Valid login succeeded and the Dashboard is visible');

    console.log('Step 5: Open the logged-in user menu and log out');
    const userMenu = page.getByRole('link', { name: 'arrow_drop_down' });
    await expect(userMenu).toBeVisible();
    await userMenu.click();
    await expect(page.getByRole('link', { name: 'Logout from all browsers' })).toBeVisible();
    const logoutButton = page.getByRole('link', { name: 'oxd_logout_round Log Out' });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click({ noWaitAfter: true });

    await expect(page).toHaveURL(/auth\/(login|seamlessLogin)/i);
    await expect(loginButton).toBeVisible();
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    console.log('Logout succeeded and the login page is visible again');

    console.log('Step 6: Use browser Back and verify protected content stays unavailable');
    await page.goBack();
    await expect(loginButton).toBeVisible();
    await expect(page.getByText(TC_01_LoginOrangeHrm.dashboardText, { exact: true })).toHaveCount(0);
    console.log('Protected dashboard content is not accessible after logout');
});
