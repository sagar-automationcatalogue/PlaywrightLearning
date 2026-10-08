import { expect, test } from '@playwright/test';
import { TC_01_Login } from '../../../test-data/practiceSoftware.ts';

test('@smoke TC_01_Login: Invalid Login → Valid Login → Account → Logout → Protected Route', async ({ page }) => {
    const homeUrl = 'https://practicesoftwaretesting.com/';
    const email = `${TC_01_Login.emailPrefix}${Date.now()}${TC_01_Login.emailDomain}`;
    const validPassword = TC_01_Login.validPassword;

    // Register a fresh learner account so this test does not depend on the
    // shared demo account's lockout state.
    await page.goto(`${homeUrl}auth/register`);
    await expect(page.getByRole('heading', { name: /customer registration/i })).toBeVisible();
    await page.route(/zippopotam|postcode|postal|zip/i, async route => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
            street: 'Playwright Training Street', house_number: '42', city: 'Vienna',
            state: 'Vienna', country: 'Austria', postcode: '1010',
        }) });
    });
    await page.getByLabel(/country/i).first().selectOption({ label: TC_01_Login.registration.country });
    const registrationValues: Array<[RegExp, string]> = [
        [/first name/i, TC_01_Login.registration.firstName], [/last name/i, TC_01_Login.registration.lastName],
        [/date of birth|birth/i, TC_01_Login.registration.dateOfBirth], [/email/i, email],
        [/postal|zip/i, TC_01_Login.registration.postcode], [/house|building|number/i, TC_01_Login.registration.houseNumber],
        [/phone/i, TC_01_Login.registration.phone],
    ];
    for (const [label, value] of registrationValues) {
        const field = page.getByLabel(label).first();
        if (await field.count() && await field.isEditable()) await field.fill(value);
    }
    await page.getByLabel(/street/i).fill(TC_01_Login.registration.street);
    await page.getByLabel(/city/i).fill(TC_01_Login.registration.city);
    await page.getByLabel(/state/i).fill(TC_01_Login.registration.state);
    const registrationPassword = page.getByLabel(/^password$/i).first();
    const registrationConfirmation = page.getByLabel(/confirm.*password/i).first();
    await registrationPassword.fill(TC_01_Login.registration.weakPassword);
    if (await registrationConfirmation.count()) await registrationConfirmation.fill(TC_01_Login.registration.weakPassword);
    const registrationButton = page.getByRole('button', { name: /register|sign up/i });
    await registrationButton.click();
    await expect(page.getByText(/password.*(length|character|number|uppercase|special)|weak password/i).first()).toBeVisible();
    await registrationPassword.fill(TC_01_Login.emptyValue);
    await registrationPassword.pressSequentially(validPassword);
    await registrationPassword.press('Tab');
    if (await registrationConfirmation.count()) await registrationConfirmation.fill(validPassword);
    await expect(page.locator('form')).not.toHaveClass(/ng-invalid/);
    await registrationButton.click();
    await expect(page).toHaveURL(/auth\/login|account/);
    if (await page.getByPlaceholder('Your email').count()) {
        await page.getByPlaceholder('Your email').fill(email);
        await page.getByPlaceholder('Your password').fill(validPassword);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL(/\/account/);
        const accountMenu = page.getByRole('menubar', { name: 'Main menu' });
        await accountMenu.getByRole('menuitem').last().getByRole('button').click();
        await accountMenu.getByText('Sign out', { exact: true }).click();
    }

    // Open Toolshop and verify the application shell and sign-in navigation.
    await page.goto(homeUrl);
    await expect(page).toHaveTitle(/Practice Software Testing.*Toolshop/i);
    const mainNavigation = page.getByRole('navigation').filter({
        has: page.getByRole('menubar', { name: 'Main menu' }),
    });
    await expect(mainNavigation).toBeVisible();
    await expect(page.getByText('Sign in', { exact: true })).toBeVisible();
    await page.getByText('Sign in', { exact: true }).click();
    await expect(page).toHaveURL(/\/auth\/login/);

    const emailField = page.getByPlaceholder('Your email');
    const passwordField = page.getByLabel('Password *');
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(emailField).toBeVisible();
    await expect(emailField).toBeEnabled();
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    // Submit an invalid password and verify the account stays unauthenticated.
    await emailField.fill(email);
    await expect(emailField).toHaveValue(email);
    await passwordField.fill(TC_01_Login.invalidLoginPassword);
    await expect(passwordField).toHaveValue(TC_01_Login.invalidLoginPassword);
    const invalidLoginResponse = page.waitForResponse(response =>
        response.request().method() === 'POST' && /login/i.test(response.url()),
    );
    await loginButton.click();
    const rejectedLogin = await invalidLoginResponse;
    expect(rejectedLogin.ok()).toBe(false);
    const errorMessage = page.getByText(/invalid email or password|incorrect|locked|unable to log in/i);
    if (await errorMessage.count()) await expect(errorMessage.first()).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByText('Sign in', { exact: true })).toBeVisible();

    // Clear the form and sign in with the registered credentials.
    await emailField.clear();
    await passwordField.clear();
    await expect(emailField).toHaveValue(TC_01_Login.emptyValue);
    await expect(passwordField).toHaveValue(TC_01_Login.emptyValue);
    await emailField.fill(email);
    await passwordField.fill(validPassword);
    await loginButton.click();

    // Confirm login and open the authenticated account area.
    const mainMenu = page.getByRole('menubar', { name: 'Main menu' });
    await expect(mainMenu).toBeVisible();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole('heading', { name: 'My account', exact: true })).toBeVisible();
    const accountMenuItem = mainMenu.getByRole('menuitem').filter({ hasText: /Jane Doe|account/i });
    await expect(accountMenuItem).toBeVisible();
    await accountMenuItem.click();
    const myAccountLink = page.getByRole('link', { name: /my account/i });
    await expect(myAccountLink).toBeVisible();
    await myAccountLink.click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole('heading', { name: 'My account', exact: true })).toBeVisible();

    // Return to the product catalog and confirm the authenticated menu remains available.
    await page.goto(homeUrl);
    await expect(mainMenu).toBeVisible();
    const userMenuItem = mainMenu.getByRole('menuitem').last();
    await expect(userMenuItem).toBeVisible();
    await userMenuItem.getByRole('button').click();
    const signOutOption = mainMenu.getByText('Sign out', { exact: true });
    await expect(signOutOption).toBeVisible();
    await signOutOption.click();

    // Confirm the anonymous navigation returns and a protected route redirects to sign in.
    await expect(page.getByText('Sign in', { exact: true })).toBeVisible();
    await page.goto(`${homeUrl}account`);
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
});
