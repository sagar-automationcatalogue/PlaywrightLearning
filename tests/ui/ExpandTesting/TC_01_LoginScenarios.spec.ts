import { test } from '@playwright/test';
import { ExpandTesting_LoginPage } from '../../../src/pages/ExpandTesting_LoginPage';
import { expandTestingBaseURL, joinBaseURL } from '../../../src/config/EnvironmentConfig';
import { URLConfig } from '../../../src/config/URLConfig';
import { PlaywrightUtils } from '../../../src/utils/PlaywrightUtils';

test('@smoke TC_01_LoginScenarios: Invalid Login, Valid Login, Secure Area, and Logout', async ({ page }) => {
	const loginPage = new ExpandTesting_LoginPage(page);

	// Step 1: Open the Login page.
	await PlaywrightUtils.navigateToURL(
		page,
		joinBaseURL(expandTestingBaseURL, URLConfig.UI.ExpandTesting.loginURL)
	);
	await loginPage.openLoginPage();
	await loginPage.submitInvalidUsernameAndVerifyRejection();
	await loginPage.submitValidUsernameWithInvalidPasswordAndVerifyProtectedArea();
	await loginPage.submitValidCredentialsAndVerifyAuthenticatedState();
	await loginPage.logoutAndVerifyUserRemainsLoggedOut();
});
