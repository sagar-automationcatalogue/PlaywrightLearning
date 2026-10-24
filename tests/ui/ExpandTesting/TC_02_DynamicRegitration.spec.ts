import { test } from "@playwright/test";
import { ExpandTesting_LoginPage } from "../../../src/pages/ExpandTesting_LoginPage";
import { ExpandTesting_RegistrationPage } from "../../../src/pages/ExpandTesting_RegistrationPage";

/** Testcase developed by Soujanya - Completed */
test(`@sanity TC_02_DynamicRegistration validation and login`, async ({ page }) => {
    const registrationPage = new ExpandTesting_RegistrationPage(page);
    const loginPage = new ExpandTesting_LoginPage(page);

    await registrationPage.openRegistrationPageAndVerifyControls();
    await registrationPage.submitEmptyFormAndVerifyRequiredFields();
    const username = await registrationPage.submitUsernameWithoutPasswordAndVerifyRequiredFields();
    await registrationPage.clearFieldsAndVerifyReset();
    await registrationPage.submitMismatchedPasswordsAndVerifyError(username);
    await registrationPage.correctConfirmationAndRegister(username);

    await loginPage.loginWithRegisteredUser(username);
    await loginPage.logoutAndVerifyLoginPage();
    await loginPage.loginAgainAndLogout(username);
});