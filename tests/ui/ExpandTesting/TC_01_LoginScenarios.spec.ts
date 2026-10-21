import { test } from '@playwright/test';
import { ExpandTesting_LoginPage } from '../../../src/pages/ExpandTesting_LoginPage.ts';

test('@smoke TC_01_LoginScenarios: Invalid Login, Valid Login, Secure Area, and Logout', async ({ page }) => {
	const loginPage = new ExpandTesting_LoginPage(page);

	// Step 1: Open the Login page.
	await loginPage.openLoginPage();
	await loginPage.submitInvalidUsernameAndVerifyRejection();
	await loginPage.submitValidUsernameWithInvalidPasswordAndVerifyProtectedArea();
	await loginPage.submitValidCredentialsAndVerifyAuthenticatedState();
	await loginPage.logoutAndVerifyUserRemainsLoggedOut();
});
