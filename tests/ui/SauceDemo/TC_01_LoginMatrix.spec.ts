import { test } from '@playwright/test';
import { TC_01_LoginMatrix } from '../../../test-data/sauceDemo';
import { SauceDemo_LoginPage } from '../../../src/pages/SauceDemo_LoginPage';
import { SauceDemo_InventoryPage } from '../../../src/pages/SauceDemo_InventoryPage';
import { sauceDemoBaseURL } from '../../../src/config/EnvironmentConfig';
import { PlaywrightUtils } from '../../../src/utils/PlaywrightUtils';
import { Constants} from '../../../src/constants/constants';

test('@smoke TC_01_Login matrix: Data-Driven Login Matrix:Empty->Invalid->Locked Out->Standard User', async ({ page }) => {
    const loginPage = new SauceDemo_LoginPage(page);
    const inventoryPage = new SauceDemo_InventoryPage(page);

    await PlaywrightUtils.navigateToURL(page, sauceDemoBaseURL);
    await loginPage.openLoginPage();
    console.log('Login page is displayed');

    await loginPage.reloadLoginPage();
    await loginPage.verifyLoginFormUsable();

    await loginPage.submitEmptyLoginAndVerify();
    console.log('Required field validation is triggered');
    await page.waitForTimeout(2000);

    await loginPage.reloadLoginPage();
    await loginPage.submitPasswordWithoutUsernameAndVerify(TC_01_LoginMatrix.validPassword);
    console.log('Empty username is rejected');

    await loginPage.dismissLoginError();
    console.log('Error UI can be reset');

    await loginPage.reloadLoginPage();
    await loginPage.populateUsernameAndVerify(TC_01_LoginMatrix.standardUsername);
    console.log('Only username is populated');

    await loginPage.reloadLoginPage();
    await loginPage.submitWithoutPasswordAndVerify(
        TC_01_LoginMatrix.invalidUsername,
        Constants.emptyValue,
        Constants.SauceDemo.errors.passwordRequired
    );
    console.log('Second negative login is submitted');

    await loginPage.reloadLoginPage();
    await loginPage.submitWithoutPasswordAndVerify(
        TC_01_LoginMatrix.standardUsername,
        Constants.emptyValue,
        Constants.SauceDemo.errors.passwordRequired
    );
    console.log('Empty Password is rejected');

    await loginPage.clearCredentialsAndVerify(Constants.emptyValue);
    console.log('Inputs return to baseline');

    await loginPage.reloadLoginPage();
    await loginPage.submitInvalidCredentialsAndVerify(
        TC_01_LoginMatrix.invalidUsername,
        TC_01_LoginMatrix.invalidPassword,
        Constants.SauceDemo.errors.invalidCredentials
    );
    console.log('Invalid credentials are populated');

    await loginPage.reloadLoginPage();
    await loginPage.populateLockedCredentialsAndVerify(
        TC_01_LoginMatrix.lockedOutUsername,
        TC_01_LoginMatrix.validPassword
    );
    console.log('Locked Persona credentials are populated');

    await loginPage.reloadLoginPage();
    await loginPage.submitLockedCredentialsAndVerify(
        TC_01_LoginMatrix.lockedOutUsername,
        TC_01_LoginMatrix.validPassword,
        Constants.SauceDemo.errors.lockedOut
    );
    console.log('Locked user authentication is attempted');

    await loginPage.clearCredentialsAndVerify(Constants.emptyValue);
    console.log('Locked account behavior is correct');

    await loginPage.reloadLoginPage();
    await loginPage.submitValidCredentials(
        TC_01_LoginMatrix.standardUsername,
        TC_01_LoginMatrix.validPassword
    );
    await page.waitForTimeout(2000);
    await inventoryPage.verifyInventoryLoaded();
    console.log('user is redirected to inventory');
    await page.waitForTimeout(2000);

    await inventoryPage.logout();
    console.log('Session is ended');
    await page.waitForTimeout(2000);
    console.log('Logout succeeds');

    await page.goBack();
    await loginPage.verifyProtectedRouteDenied(Constants.SauceDemo.errors.protectedRoute);
    console.log('Logged out state remains effective');
});
