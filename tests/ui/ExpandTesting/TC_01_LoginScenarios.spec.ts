import { expect, test } from '@playwright/test';

const TC_01_LoginScenarios = {  
  invalidUsername: 'wrongUser',
  validUsername: 'practice',
  validPassword: 'SuperSecretPassword!',
  invalidPassword: 'WrongPassword'
}

test('@smoke TC_01_LoginScenarios: Invalid Login, Valid Login, Secure Area, and Logout', async ({ page }) => {
	const loginUrl = 'https://practice.expandtesting.com/login';
	const secureUrl = 'https://practice.expandtesting.com/secure';

	// Step 1: Open the Login page.
	console.log('Opening the ExpandTesting Login page');
	await page.goto(loginUrl);
	await expect(page).toHaveURL(loginUrl);

	// Step 2: Verify the Login page heading/content.
	await expect(page.getByRole('heading').first()).toBeVisible();

	const usernameField = page.getByRole('textbox', { name: 'Username' });
	const passwordField = page.getByRole('textbox', { name: 'Password' });
	const loginButton = page.getByRole('button', { name: 'Login' });

	// Steps 3-5: Verify the username, password, and Login controls.
	await expect(usernameField).toBeVisible();
	await expect(usernameField).toBeEnabled();
	await expect(passwordField).toBeVisible();
	await expect(passwordField).toBeEnabled();
	await expect(loginButton).toBeVisible();
	await expect(loginButton).toBeEnabled();
	console.log('Login heading, fields, and button are available');

	// Steps 6-8: Submit an invalid username with the valid password.
	await usernameField.fill(TC_01_LoginScenarios.invalidUsername);
	await expect(usernameField).toHaveValue(TC_01_LoginScenarios.invalidUsername);
	await passwordField.fill(TC_01_LoginScenarios.validPassword);
	await expect(passwordField).toHaveValue(TC_01_LoginScenarios.validPassword);
	await loginButton.click();

	// Steps 9-10: Verify rejection and remain on the Login page.
	await expect(page.getByRole('alert')).toHaveText(/Your password is invalid!/i);
	await expect(page).toHaveURL(loginUrl);
	console.log('Invalid username was rejected');

	// Step 11: Clear both fields.
	await usernameField.fill('');
	await passwordField.fill('');
	await expect(usernameField).toHaveValue('');
	await expect(passwordField).toHaveValue('');

	// Steps 12-14: Submit the valid username with an invalid password.
	await usernameField.fill(TC_01_LoginScenarios.validUsername);
	await expect(usernameField).toHaveValue(TC_01_LoginScenarios.validUsername);
	await passwordField.fill(TC_01_LoginScenarios.invalidPassword);
	await expect(passwordField).toHaveValue(TC_01_LoginScenarios.invalidPassword);
	await loginButton.click();

	// Steps 15-16: Verify rejection and confirm the secure page is inaccessible.
	await expect(page.getByRole('alert')).toHaveText(/Your password is invalid!/i);
	await expect(page).toHaveURL(loginUrl);
	await page.goto(secureUrl);
	await expect(page).toHaveURL(loginUrl);
	await expect(loginButton).toBeVisible();
	console.log('Invalid password was rejected and the secure page remained protected');

	// Step 17: Clear both fields again.
	await usernameField.fill('');
	await passwordField.fill('');
	await expect(usernameField).toHaveValue('');
	await expect(passwordField).toHaveValue('');

	// Steps 18-20: Submit valid credentials.
	await usernameField.fill(TC_01_LoginScenarios.validUsername);
	await expect(usernameField).toHaveValue(TC_01_LoginScenarios.validUsername);
	await passwordField.fill(TC_01_LoginScenarios.validPassword);
	await expect(passwordField).toHaveValue(TC_01_LoginScenarios.validPassword);
	await loginButton.click();
	console.log('Submitting valid login credentials');

	// Steps 21-23: Verify successful login, confirmation, and Logout control.
	await expect(page).toHaveURL(/\/secure/);
	await expect(page.getByText('You logged into a secure area!', { exact: true })).toBeVisible();
	const logoutButton = page.getByRole('link', { name: 'Logout' });
	await expect(logoutButton).toBeVisible();

	// Steps 24-25: Refresh and verify the authenticated state remains.
	await page.reload();
	await expect(page).toHaveURL(/\/secure/);
	await expect(page.getByRole('heading', { name: 'Hi, practice!' })).toBeVisible();
	await expect(logoutButton).toBeVisible();
	console.log('Authenticated state remains after refreshing the secure page');

	// Steps 26-28: Log out and verify the Login page and optional message.
	await logoutButton.click();
	await expect(page).toHaveURL(loginUrl);
	await expect(loginButton).toBeVisible();
	const logoutMessage = page.getByText('You logged out of the secure area!', { exact: true });
	if (await logoutMessage.count()) {
		await expect(logoutMessage).toBeVisible();
	}

	// Steps 29-30: Use browser Back and verify the user remains logged out.
	await page.goBack();
	await expect(page).toHaveURL(loginUrl);
	await expect(loginButton).toBeVisible();
	await expect(page.getByText('You logged into a secure area!', { exact: true })).toHaveCount(0);
	await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
	console.log('Browser Back did not restore the authenticated state');
});
