import { Page, Locator, expect } from '@playwright/test';
import { TC_01_Login, TC_05_Favorites } from '../../test-data/practiceSoftware';
import { joinBaseURL } from '../config/EnvironmentConfig';
import { URLConfig } from '../config/URLConfig';

export class PracticeSoftware_RegistrationPage {
    private customerRegistrationHeading: Locator;
    private countryField: Locator;
    private registrationFields: Array<[RegExp, string]>;
    private streetField: Locator;
    private cityField: Locator;
    private stateField: Locator;
    private registrationPassword: Locator;
    private registrationConfirmation: Locator;
    private registrationButton: Locator;
    private weakPasswordError: Locator;
    private registrationForm: Locator;

    constructor(private page: Page) {
        this.customerRegistrationHeading = page.getByRole('heading', { name: /customer registration/i });
        this.countryField = page.getByLabel(/country/i).first();
        this.registrationFields = [
            [/first name/i, TC_01_Login.registration.firstName],
            [/last name/i, TC_01_Login.registration.lastName],
            [/date of birth|birth/i, TC_01_Login.registration.dateOfBirth],
            [/email/i, ''],
            [/postal|zip/i, TC_01_Login.registration.postcode],
            [/house|building|number/i, TC_01_Login.registration.houseNumber],
            [/phone/i, TC_01_Login.registration.phone],
        ];
        this.streetField = page.getByLabel(/street/i);
        this.cityField = page.getByLabel(/city/i);
        this.stateField = page.getByLabel(/state/i);
        this.registrationPassword = page.getByLabel(/^password$/i).first();
        this.registrationConfirmation = page.getByLabel(/confirm.*password/i).first();
        this.registrationButton = page.getByRole('button', { name: /register|sign up/i });
        this.weakPasswordError = page.getByText(/password.*(length|character|number|uppercase|special)|weak password/i).first();
        this.registrationForm = page.locator('form');
    }

    async openRegistrationPage(homeUrl: string): Promise<void> {
        await this.page.goto(joinBaseURL(homeUrl, URLConfig.UI.PracticeSoftwareTesting.registrationURL));
        await expect(this.customerRegistrationHeading).toBeVisible();
    }

    async registerFreshAccount(
        country: string,
        email: string,
        weakPassword: string,
        validPassword: string,
        emptyValue: string
    ): Promise<void> {
        await this.countryField.selectOption({ label: country });
        for (const [label, configuredValue] of this.registrationFields) {
            const value = label.source === 'email' ? email : configuredValue;
            const field = this.page.getByLabel(label).first();
            if (await field.count() && await field.isEditable()) {
                await field.fill(value);
            }
        }
        await this.streetField.fill(TC_01_Login.registration.street);
        await this.cityField.fill(TC_01_Login.registration.city);
        await this.stateField.fill(TC_01_Login.registration.state);
        await this.registrationPassword.fill(weakPassword);
        if (await this.registrationConfirmation.count()) {
            await this.registrationConfirmation.fill(weakPassword);
        }

        await this.registrationButton.click();
        await expect(this.weakPasswordError).toBeVisible();
        await this.registrationPassword.fill(emptyValue);
        await this.registrationPassword.pressSequentially(validPassword);
        await this.registrationPassword.press('Tab');
        if (await this.registrationConfirmation.count()) {
            await this.registrationConfirmation.fill(validPassword);
        }
        await expect(this.registrationForm).not.toHaveClass(/ng-invalid/);
        await this.registrationButton.click();
        await expect(this.page).toHaveURL(new RegExp(
            `${URLConfig.UI.PracticeSoftwareTesting.loginURL}|${URLConfig.UI.PracticeSoftwareTesting.accountURL}`,
            'i'
        ));
    }

    async registerFavoritesAccount(email: string, password: string, emptyValue: string): Promise<void> {
        await expect(this.customerRegistrationHeading).toBeVisible();
        if (await this.customerRegistrationHeading.count()) {
            await this.countryField.selectOption({ label: TC_05_Favorites.registration.country });
            const registrationFields: Array<[RegExp, string]> = [
                [/first name/i, TC_05_Favorites.registration.firstName],
                [/last name/i, TC_05_Favorites.registration.lastName],
                [/date of birth|birth/i, TC_05_Favorites.registration.dateOfBirth],
                [/email/i, email],
                [/postal|zip/i, TC_05_Favorites.registration.postcode],
                [/house|building|number/i, TC_05_Favorites.registration.houseNumber],
                [/phone/i, TC_05_Favorites.registration.phone],
            ];
            for (const [label, value] of registrationFields) {
                const field = this.page.getByLabel(label).first();
                if (await field.count() && await field.isEditable()) {
                    await field.fill(value);
                }
            }
            await this.streetField.fill(TC_05_Favorites.registration.street);
            const registrationCity = this.page.getByLabel(/city/i);
            const registrationState = this.page.getByLabel(/state/i);
            if (!(await registrationCity.inputValue())) {
                await registrationCity.fill(TC_05_Favorites.registration.city);
            }
            if (!(await registrationState.inputValue())) {
                await registrationState.fill(TC_05_Favorites.registration.state);
            }
            await expect(registrationCity).toHaveValue(TC_05_Favorites.registration.city);
            await expect(registrationState).toHaveValue(TC_05_Favorites.registration.state);

            await this.registrationPassword.fill(TC_05_Favorites.registration.weakPassword);
            if (await this.registrationConfirmation.count()) {
                await this.registrationConfirmation.fill(TC_05_Favorites.registration.weakPassword);
            }
            await this.registrationButton.click();
            await expect(this.weakPasswordError).toBeVisible();
            await this.registrationPassword.fill(emptyValue);
            await this.registrationPassword.pressSequentially(password);
            await this.registrationPassword.press('Tab');
            if (await this.registrationConfirmation.count()) {
                await this.registrationConfirmation.fill(password);
            }
            await expect(this.registrationForm).not.toHaveClass(/ng-invalid/);
            await this.registrationButton.click();
        }
    }
}
