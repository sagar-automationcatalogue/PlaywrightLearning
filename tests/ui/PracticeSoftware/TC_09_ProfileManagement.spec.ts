import { expect, test } from '@playwright/test';
import { TC_09_ProfileManagement } from '../../../test-data/practiceSoftware.ts';

test('@regressionTC_09_ProfileManagement: Edit Profile → Reject Mismatched Password → Restore', async ({ page }) => {
    const toolshopUrl = 'https://practicesoftwaretesting.com/';
    const registeredEmail = `${TC_09_ProfileManagement.emailPrefix}${Date.now()}${TC_09_ProfileManagement.emailDomain}`;
    const password = TC_09_ProfileManagement.password;
    await page.goto(`${toolshopUrl}auth/register`);
    await expect(page.getByRole('heading', { name: /customer registration/i })).toBeVisible();
    if (await page.getByRole('heading', { name: /customer registration/i }).count()) {
        await page.route(/zippopotam|postcode|postal|zip/i, async route => {
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
                street: 'Playwright Training Street', house_number: '42', city: 'Vienna',
                state: 'Vienna', country: 'Austria', postcode: '1010',
            }) });
        });
        await page.getByLabel(/country/i).first().selectOption({ label: TC_09_ProfileManagement.registration.country });
        const registrationValues: Array<[RegExp, string]> = [
            [/first name/i, TC_09_ProfileManagement.registration.firstName],
            [/last name/i, TC_09_ProfileManagement.registration.lastName],
            [/date of birth|birth/i, TC_09_ProfileManagement.registration.dateOfBirth],
            [/email/i, registeredEmail],
            [/postal|zip/i, TC_09_ProfileManagement.registration.postcode],
            [/house|building|number/i, TC_09_ProfileManagement.registration.houseNumber],
            [/phone/i, TC_09_ProfileManagement.registration.phone],
        ];
        for (const [label, value] of registrationValues) {
            const field = page.getByLabel(label).first();
            if (await field.count() && await field.isEditable()) await field.fill(value);
        }
        await page.getByLabel(/street/i).fill(TC_09_ProfileManagement.registration.street);
        const registrationCity = page.getByLabel(/city/i);
        const registrationState = page.getByLabel(/state/i);
        if (!(await registrationCity.inputValue())) await registrationCity.fill(TC_09_ProfileManagement.registration.city);
        if (!(await registrationState.inputValue())) await registrationState.fill(TC_09_ProfileManagement.registration.state);
        await expect(registrationCity).toHaveValue(TC_09_ProfileManagement.registration.city);
        await expect(registrationState).toHaveValue(TC_09_ProfileManagement.registration.state);
        const passwordField = page.getByLabel(/^password$/i).first();
        const confirmation = page.getByLabel(/confirm.*password/i).first();
        await passwordField.fill(TC_09_ProfileManagement.registration.weakPassword);
        if (await confirmation.count()) await confirmation.fill(TC_09_ProfileManagement.registration.weakPassword);
        const registerButton = page.getByRole('button', { name: /register|sign up/i });
        await registerButton.click();
        await expect(page.getByText(/password.*(length|character|number|uppercase|special)|weak password/i).first()).toBeVisible();
        await passwordField.fill(TC_09_ProfileManagement.emptyValue);
        await passwordField.pressSequentially(password);
        await passwordField.press('Tab');
        if (await confirmation.count()) await confirmation.fill(password);
        await expect(page.locator('form')).not.toHaveClass(/ng-invalid/);
        await registerButton.click();
        await expect(page).toHaveURL(/auth\/login|account/);
    }
    await page.goto(`${toolshopUrl}auth/login`);
    await page.getByPlaceholder('Your email').fill(registeredEmail);
    await page.getByPlaceholder('Your password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/account/);
    const menu = page.getByRole('menubar', { name: 'Main menu' });
    await menu.getByRole('menuitem').last().getByRole('button').click();
    await menu.getByRole('link', { name: /my profile/i }).click();
    await expect(page).toHaveURL(/account\/profile/);

    const fields = [
        { label: /first name/i, temporary: TC_09_ProfileManagement.temporaryProfile.firstName },
        { label: /last name/i, temporary: TC_09_ProfileManagement.temporaryProfile.lastName },
        { label: /phone/i, temporary: TC_09_ProfileManagement.temporaryProfile.phone },
        { label: /street/i, temporary: TC_09_ProfileManagement.temporaryProfile.street },
        { label: /city/i, temporary: TC_09_ProfileManagement.temporaryProfile.city },
        { label: /state|province/i, temporary: TC_09_ProfileManagement.temporaryProfile.state },
        { label: /postal|zip/i, temporary: TC_09_ProfileManagement.temporaryProfile.postcode },
    ];
    const originalValues = new Map<string, string>();
    for (const field of fields) {
        const input = page.getByLabel(field.label).first();
        if (await input.count() && await input.isEditable()) originalValues.set(field.label.source, await input.inputValue());
    }
    const email = page.getByLabel(/email/i).first();
    if (await email.count()) await expect(email).toBeDisabled().catch(async () => expect(email).toHaveAttribute('readonly', /(?:true)?/));

    for (const field of fields) {
        const input = page.getByLabel(field.label).first();
        if (await input.count() && await input.isEditable()) await input.fill(field.temporary);
    }
    const saveProfile = page.getByRole('button', { name: /save|update/i }).first();
    await saveProfile.click();
    for (const field of fields) {
        await expect(page.getByLabel(field.label).first()).toHaveValue(field.temporary);
    }

    const passwordFields = [
        [/current password/i, TC_09_ProfileManagement.passwordChange.current],
        [/new password/i, TC_09_ProfileManagement.passwordChange.new],
        [/confirm.*password/i, TC_09_ProfileManagement.passwordChange.confirmation],
    ] as const;
    let passwordFormFound = true;
    for (const [label, value] of passwordFields) {
        const input = page.getByLabel(label).first();
        if (!(await input.count())) { passwordFormFound = false; break; }
        await input.fill(value);
    }
    if (passwordFormFound) {
        const savePassword = page.getByRole('button', { name: /change password|update password|save/i }).last();
        await savePassword.click();
        await expect(page.getByText(/match|same|password/i).last()).toBeVisible();
        for (const [label] of passwordFields) await page.getByLabel(label).first().fill(TC_09_ProfileManagement.emptyValue);
    }

    for (const field of fields) {
        const input = page.getByLabel(field.label).first();
        const original = originalValues.get(field.label.source);
        if (original !== undefined && await input.count() && await input.isEditable()) await input.fill(original);
    }
    await saveProfile.click();
    for (const field of fields) {
        const original = originalValues.get(field.label.source);
        if (original !== undefined) await expect(page.getByLabel(field.label).first()).toHaveValue(original);
    }
    const logoutMenu = page.getByRole('menubar', { name: 'Main menu' });
    await logoutMenu.getByRole('menuitem').last().getByRole('button').click();
    await logoutMenu.getByText('Sign out', { exact: true }).click();
    await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
});
