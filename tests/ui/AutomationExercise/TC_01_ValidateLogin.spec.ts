import { test } from '@playwright/test';
import { AutomationExercise_HomePage } from '../../../src/pages/AutomationExercise_HomePage.ts';
import { AutomationExercise_LoginPage } from '../../../src/pages/AutomationExercise_LoginPage.ts';
import { AutomationExercise_ProductsPage } from '../../../src/pages/AutomationExercise_ProductsPage.ts';

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
    // =========================================================
    // Ignore / Block Google Advertisements
    // Keep this before page.goto()
    // =========================================================
    await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (
            url.includes('googleads') ||
            url.includes('googlesyndication') ||
            url.includes('doubleclick') ||
            url.includes('googletagservices') ||
            url.includes('adservice.google') ||
            url.includes('google_vignette')
        ) {
            await route.abort();
        }
        else {
            await route.continue();
        }
    });

    await homePage.openAndVerifyHomePage();
    await homePage.openSignupLoginPage();
    await loginPage.verifyLoginForm();
    await loginPage.submitInvalidCredentialsAndVerifyError();
    await loginPage.submitValidCredentialsAndVerifyLogin();
    await productsPage.openProductsAndVerifyAuthenticatedState();
    await loginPage.verifyLoggedInAsVisible();
    await loginPage.logoutAndVerifyProtectedState();
});