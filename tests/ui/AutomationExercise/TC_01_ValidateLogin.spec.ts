import { test } from '@playwright/test';
import { AutomationExercise_HomePage } from '../../../src/pages/AutomationExercise_HomePage';
import { AutomationExercise_LoginPage } from '../../../src/pages/AutomationExercise_LoginPage';
import { AutomationExercise_ProductsPage } from '../../../src/pages/AutomationExercise_ProductsPage';
import { HandlingPopups } from '../../../src/components/HandlingPopups';
import { PlaywrightUtils } from '../../../src/utils/PlaywrightUtils';
import { automationExerciseBaseURL } from '../../../src/config/EnvironmentConfig';

/** Testcase developed by Soujanya - Completed */
test(`@smoke TC_01_ValidateLogin: Invalid Login → Valid Login → Logout → Protected State Validation`, async({page, browserName}) =>{
    const homePage = new AutomationExercise_HomePage(page);
    const loginPage = new AutomationExercise_LoginPage(page);
    const productsPage = new AutomationExercise_ProductsPage(page);

    test.slow();
    if(browserName === 'webkit'){
        test.slow();
        //test.setTimeout(90_000);
    }
    let ob_handlingPopups = new HandlingPopups();
    await ob_handlingPopups.handleGoogleAds(page);
    await PlaywrightUtils.navigateToURL(page, automationExerciseBaseURL);

    await homePage.openAndVerifyHomePage();
    await homePage.openSignupLoginPage();
    await loginPage.verifyLoginForm();
    await loginPage.submitInvalidCredentialsAndVerifyError();
    await loginPage.submitValidCredentialsAndVerifyLogin();
    await productsPage.openProductsAndVerifyAuthenticatedState();
    await loginPage.verifyLoggedInAsVisible();
    await loginPage.logoutAndVerifyProtectedState();
});