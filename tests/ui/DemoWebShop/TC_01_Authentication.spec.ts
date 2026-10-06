import { expect, test } from '@playwright/test';

test('@smoke TC_01_Authentication: Invalid Login, Valid Login and Logout', async ({ page }) => {
	const email = 'sagar.automationcatalogue8@gmail.com';

	// Step 1: Launch browser and open Demo Web Shop.
	console.log('Launching Demo Web Shop');
	await page.goto('https://demowebshop.tricentis.com/');	

	// Step 2: Verify the home page is loaded.
	await expect(page).toHaveURL('https://demowebshop.tricentis.com/');
	await expect(page.getByRole('heading', { name: 'Welcome to our store' })).toBeVisible();

	// Step 3: Verify Register and Log in links are displayed.
	await expect(page.getByRole('link', { name: 'Register', exact: true })).toBeVisible();
	const loginLink = page.getByRole('link', { name: 'Log in', exact: true });
	await expect(loginLink).toBeVisible();
	console.log('Home page loaded and Register/Login links are visible');

	// Step 4: Click Log in.
	console.log('Opening the Login page');
	await loginLink.click();
	await expect(page).toHaveURL('https://demowebshop.tricentis.com/login');

	// Step 5: Verify the login page heading is displayed.
	const loginHeading = page.getByRole('heading', { name: 'Welcome, Please Sign In!' });
	await expect(loginHeading).toBeVisible();

	const emailField = page.getByRole('textbox', { name: 'Email:' });
	const passwordField = page.getByRole('textbox', { name: 'Password:' });

	// Step 6: Enter the registered email.
	console.log('Entering credentials for the invalid login attempt');
	await emailField.fill(email);
	await expect(emailField).toHaveValue(email);

	// Step 7: Enter the invalid password from the supplied test data.
	await passwordField.fill('WrongPassword!123');
	await expect(passwordField).toHaveValue('WrongPassword!123');

	// Step 8: Click Log in.
	await page.getByRole('button', { name: 'Log in', exact: true }).click();

	// Steps 9-10: Verify the failure message and that the user remains on Login.
	console.log('Verifying the invalid login result');
	const loginError = page.locator('.validation-summary-errors');
	await expect(loginError).toBeVisible();
	await expect(loginError).not.toBeEmpty();
	await expect(page).toHaveURL(/\/login/);

	// Step 11: Clear the password field.
	await passwordField.clear();
	await expect(passwordField).toHaveValue('');

	// Step 12: Enter the valid password.
	await passwordField.fill('Admin@123');
	await expect(passwordField).toHaveValue('Admin@123');

	// Step 13: Select Remember me.
	const rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me?' });
	await rememberMeCheckbox.check();
	await expect(rememberMeCheckbox).toBeChecked();

	// Step 14: Click Log in.
	console.log('Submitting the valid login');
	await page.getByRole('button', { name: 'Log in', exact: true }).click();

	// Steps 15-16: Verify the account email and Log out are displayed.
	const accountEmailLink = page.getByRole('link', { name: email, exact: true });
	const logoutLink = page.getByRole('link', { name: 'Log out', exact: true });
	await expect(accountEmailLink).toBeVisible();
	await expect(logoutLink).toBeVisible();

	// Step 17: Click the account email.
	await accountEmailLink.click();
	const accountUrl = page.url();

	// Step 18: Verify the customer/account page is displayed.
	await expect(page.getByRole('heading', { name: 'My account - Customer info' })).toBeVisible();

	// Step 19: Navigate back to the home page while the session remains active.
	await page.getByRole('link', { name: 'Tricentis Demo Web Shop' }).click();
	await expect(page).toHaveURL('https://demowebshop.tricentis.com/');
	await expect(page.getByRole('heading', { name: 'Welcome to our store' })).toBeVisible();
	await expect(accountEmailLink).toBeVisible();

	// Step 20: Click Log out.
	console.log('Logging out and checking protected-page access');
	await logoutLink.click();

	// Step 21: Verify Log in appears again.
	await expect(page.getByRole('link', { name: 'Log in', exact: true })).toBeVisible();
	await expect(accountEmailLink).toHaveCount(0);

	// Step 22: Attempt to navigate directly to the customer account URL.
	await page.goto(accountUrl);

	// Step 23: Verify the application redirects to Login.
	await expect(page).toHaveURL(/\/login/);
	await expect(loginHeading).toBeVisible();
});
