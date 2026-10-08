import { expect, test } from "@playwright/test";
import { TC_02_DynamicRegistration } from "../../../test-data/expnadTesting.ts";

/** Testcase developed by Soujanya - Completed */
test(`@sanity TC_02_DynamicRegistration validation and login`, async ({ page }) => {

    // Steps 1-2: Open the registration page and verify its controls.
    await page.goto(`https://practice.expandtesting.com/register`);
    await expect(page).toHaveURL(`https://practice.expandtesting.com/register`);
    const usernameField = page.getByLabel(`Username`);
    const passwordField = page.getByLabel(`Password`, { exact: true });
    const confirmPasswordField = page.getByLabel(`Confirm Password`);
    const registerButton = page.getByRole(`button`, { name: `Register` });
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(confirmPasswordField).toBeVisible();
    await expect(registerButton).toBeVisible();

    await expect(usernameField).toHaveValue(TC_02_DynamicRegistration.emptyValue);
    await expect(passwordField).toHaveValue(TC_02_DynamicRegistration.emptyValue);
    await expect(confirmPasswordField).toHaveValue(TC_02_DynamicRegistration.emptyValue);
    // Steps 3-4: Submit the empty form and verify required-field validation.
    await registerButton.click();
    await expect(page.getByText(TC_02_DynamicRegistration.messages.requiredFields)).toBeVisible();
    console.log(`Required-field validation verified`);

    // Steps 5-10: Submit without a password and verify the missing-field error.
    TC_02_DynamicRegistration.username = `${TC_02_DynamicRegistration.usernamePrefix}${Date.now()}`;
    console.log(`Generated registration username: ${TC_02_DynamicRegistration.username}`);
    await usernameField.fill(TC_02_DynamicRegistration.username);
    await confirmPasswordField.fill(TC_02_DynamicRegistration.registrationPassword);
    await expect(usernameField).toHaveValue(TC_02_DynamicRegistration.username);
    await expect(passwordField).toHaveValue(TC_02_DynamicRegistration.emptyValue);
    await expect(confirmPasswordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
    await registerButton.click();
    await expect(page.getByText(TC_02_DynamicRegistration.messages.requiredFields)).toBeVisible();
    console.log(`Missing-password validation verified`);

    // Step 11: Clear the registration fields and verify they are reset.
    await usernameField.fill(TC_02_DynamicRegistration.emptyValue);
    await passwordField.fill(TC_02_DynamicRegistration.emptyValue);
    await confirmPasswordField.fill(TC_02_DynamicRegistration.emptyValue);
    await expect(usernameField).toHaveValue(TC_02_DynamicRegistration.emptyValue);
    await expect(passwordField).toHaveValue(TC_02_DynamicRegistration.emptyValue);
    await expect(confirmPasswordField).toHaveValue(TC_02_DynamicRegistration.emptyValue);
    // Steps 12-16: Submit mismatched passwords and verify the mismatch error.
    await usernameField.fill(TC_02_DynamicRegistration.username);
    await passwordField.fill(TC_02_DynamicRegistration.registrationPassword);
    await confirmPasswordField.fill(TC_02_DynamicRegistration.mismatchPassword);
    await expect(usernameField).toHaveValue(TC_02_DynamicRegistration.username);
    await expect(passwordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
    await expect(confirmPasswordField).toHaveValue(TC_02_DynamicRegistration.mismatchPassword);
    await registerButton.click();
    await expect(page.getByText(TC_02_DynamicRegistration.messages.passwordsDoNotMatch)).toBeVisible();
    console.log(`Password mismatch validation verified`);

    // Steps 17-20: Correct the confirmation and verify successful registration.
    await usernameField.fill(TC_02_DynamicRegistration.username);
    await passwordField.fill(TC_02_DynamicRegistration.registrationPassword);
    await confirmPasswordField.fill(TC_02_DynamicRegistration.registrationPassword);
    await expect(usernameField).toHaveValue(TC_02_DynamicRegistration.username);
    await expect(passwordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
    await expect(confirmPasswordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
    await registerButton.click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/login`);
    await expect(page.getByText(TC_02_DynamicRegistration.messages.registrationSuccess)).toBeVisible();
    console.log(`Registration successful`);

    // Steps 21-26: Log in with the new account and verify secure-area access.
    await usernameField.fill(TC_02_DynamicRegistration.username);
    await expect(usernameField).toHaveValue(TC_02_DynamicRegistration.username);
    await passwordField.fill(TC_02_DynamicRegistration.registrationPassword);
    await expect(passwordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
    await page.getByRole(`button`, { name: `Login` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/secure`);
    await expect(page.getByText(TC_02_DynamicRegistration.messages.loginSuccess)).toBeVisible();
    await expect(page.getByRole(`link`, { name: `Logout` })).toBeVisible();
    console.log(`First login successful`);

    // Steps 27-28: Log out and verify the Login page returns.
    await page.getByRole(`link`, { name: `Logout` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/login`);
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    console.log(`First logout successful`);

    // Steps 29-31: Log in again to verify persistence, then log out to finish.
    await usernameField.fill(TC_02_DynamicRegistration.username);
    await expect(usernameField).toHaveValue(TC_02_DynamicRegistration.username);
    await passwordField.fill(TC_02_DynamicRegistration.registrationPassword);
    await expect(passwordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
    await page.getByRole(`button`, { name: `Login` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/secure`);
    await expect(page.getByText(TC_02_DynamicRegistration.messages.loginSuccess)).toBeVisible();
    console.log(`Second login successful`);

    await page.getByRole(`link`, { name: `Logout` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/login`);
    await expect(usernameField).toBeVisible();
    await expect(page.getByRole(`link`, { name: `Logout` })).toHaveCount(0);
    console.log(`Final logout successful`);
});