import { test } from '@playwright/test';
import { OrangeHRM_HomePage } from '../../../src/pages/OrangeHRM_HomePage';
import { OrangeHRM_LoginPage } from '../../../src/pages/OrangeHRM_LoginPage'
import { TC_01_LoginOrangeHrm } from '../../../test-data/orangeHRM';
import { Constants } from '../../../src/constants/constants';
import { orangeHRMBaseURL } from '../../../src/config/EnvironmentConfig';
import { PlaywrightUtils } from '../../../src/utils/PlaywrightUtils';

test('@smoke TC_01_LoginOrangeHrm: Login → Valid Login → Dashboard → Logout', async ({ page }) => {
    const loginPage = new OrangeHRM_LoginPage(page);
    const homePage = new OrangeHRM_HomePage(page);

    console.log('Step 1: Open the OrangeHRM login page');
    await PlaywrightUtils.navigateToURL(page, orangeHRMBaseURL);
    await loginPage.openLoginPage();

    console.log('Step 2: Verify the login page and its controls');
    await loginPage.verifyLoginControls();

    console.log('Step 3: Submit an invalid password');
    await loginPage.loginWithCredentials(TC_01_LoginOrangeHrm.username, TC_01_LoginOrangeHrm.invalidPassword);
    await loginPage.verifyInvalidLogin(Constants.OrangeHRM.invalidCredentialsPattern);
    console.log('Invalid credentials were rejected; the login page remains visible');

    console.log('Step 4: Clear the fields and log in with valid credentials');
    await loginPage.verifyCredentialsCleared(Constants.emptyValue);
    await loginPage.loginWithCredentials(TC_01_LoginOrangeHrm.username, TC_01_LoginOrangeHrm.validPassword);
    await homePage.verifyDashboard();
    console.log('Valid login succeeded and the Dashboard is visible');

    console.log('Step 5: Open the logged-in user menu and log out');
    await homePage.logout();
    await loginPage.verifyLoggedOut();
    console.log('Logout succeeded and the login page is visible again');

    console.log('Step 6: Use browser Back and verify protected content stays unavailable');
    await homePage.goBackAndVerifyDashboardUnavailable();
    console.log('Protected dashboard content is not accessible after logout');
});
