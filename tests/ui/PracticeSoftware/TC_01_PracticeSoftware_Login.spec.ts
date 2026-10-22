import { test } from '@playwright/test';
import { TC_01_Login } from '../../../test-data/practiceSoftware.ts';
import { PracticeSoftware_RegistrationPage } from '../../../src/pages/PracticeSoftware_RegistrationPage.ts';
import { PracticeSoftware_LoginPage } from '../../../src/pages/PracticeSoftware_LoginPage.ts';
import { PracticeSoftware_HomePage } from '../../../src/pages/PracticeSoftware_HomePage.ts';

test('@smoke TC_01_PracticeSoftware_Login: Invalid Login → Valid Login → Account → Logout → Protected Route', async ({ page }) => {
    const homeUrl = 'https://practicesoftwaretesting.com/';
    const email = `${TC_01_Login.emailPrefix}${Date.now()}${TC_01_Login.emailDomain}`;
    const validPassword = TC_01_Login.validPassword;
    const registrationPage = new PracticeSoftware_RegistrationPage(page);
    const loginPage = new PracticeSoftware_LoginPage(page);
    const homePage = new PracticeSoftware_HomePage(page);

    // Register a fresh learner account so this test does not depend on the
    // shared demo account's lockout state.
    await registrationPage.openRegistrationPage(homeUrl);
    await page.route(/zippopotam|postcode|postal|zip/i, async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                street: 'Playwright Training Street',
                house_number: '42',
                city: 'Vienna',
                state: 'Vienna',
                country: 'Austria',
                postcode: '1010',
            }),
        });
    });
    await registrationPage.registerFreshAccount(
        TC_01_Login.registration.country,
        email,
        TC_01_Login.registration.weakPassword,
        validPassword,
        TC_01_Login.emptyValue
    );

    if (await page.getByPlaceholder('Your email').count()) {
        await loginPage.loginAndVerifyAccount(email, validPassword);
        await homePage.returnHomeAndSignOut(homeUrl);
    }

    // Open Toolshop and verify the application shell and sign-in navigation.
    await homePage.openHomeAndVerifyShell(homeUrl);
    await loginPage.openLoginFromSignIn();
    await loginPage.verifyLoginControls();

    // Submit an invalid password and verify the account stays unauthenticated.
    await loginPage.submitInvalidLoginAndVerify(email, TC_01_Login.invalidLoginPassword);

    // Clear the form and sign in with the registered credentials.
    await loginPage.submitValidLoginAndVerifyAccount(email, validPassword);

    // Confirm login and open the authenticated account area.
    await homePage.verifyAccountAndOpenAccountMenu();

    // Return to the product catalog and confirm the authenticated menu remains available.
    await homePage.returnHomeAndSignOut(homeUrl);

    // Confirm the anonymous navigation returns and a protected route redirects to sign in.
    await homePage.openProtectedAccountAndVerifyRedirect(homeUrl);
    await loginPage.verifyLoginFieldsVisible();
});
