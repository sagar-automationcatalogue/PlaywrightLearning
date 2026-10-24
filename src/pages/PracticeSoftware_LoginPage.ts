import { Page, Locator, expect } from '@playwright/test';
import { TC_01_Login } from '../../test-data/practiceSoftware';
import { URLConfig } from '../config/URLConfig';
import { Constants } from '../constants/constants';

export class PracticeSoftware_LoginPage {
    private emailField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;
    private signInLink: Locator;
    private invalidLoginMessage: Locator;
    private favoritesPasswordField: Locator;

    constructor(private page: Page) {
        this.emailField = page.getByPlaceholder('Your email');
        this.passwordField = page.getByLabel('Password *');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.signInLink = page.getByText('Sign in', { exact: true });
        this.invalidLoginMessage = page.getByText(/invalid email or password|incorrect|locked|unable to log in/i);
        this.favoritesPasswordField = page.getByPlaceholder('Your password');
    }

    async openLoginFromSignIn(): Promise<void> {
        await expect(this.signInLink).toBeVisible();
        await this.signInLink.click();
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.PracticeSoftwareTesting.loginURL));
    }

    async verifyLoginControls(): Promise<void> {
        await expect(this.emailField).toBeVisible();
        await expect(this.emailField).toBeEnabled();
        await expect(this.passwordField).toBeVisible();
        await expect(this.passwordField).toBeEnabled();
        await expect(this.loginButton).toBeVisible();
        await expect(this.loginButton).toBeEnabled();
    }

    async submitInvalidLoginAndVerify(email: string, invalidPassword: string): Promise<void> {
        await this.emailField.fill(email);
        await expect(this.emailField).toHaveValue(email);
        await this.passwordField.fill(invalidPassword);
        await expect(this.passwordField).toHaveValue(invalidPassword);
        const invalidLoginResponse = this.page.waitForResponse(response =>
            response.request().method() === 'POST' && /login/i.test(response.url()),
        );
        await this.loginButton.click();
        const rejectedLogin = await invalidLoginResponse;
        expect(rejectedLogin.ok()).toBe(false);
        if (await this.invalidLoginMessage.count()) {
            await expect(this.invalidLoginMessage.first()).toBeVisible();
        }
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.PracticeSoftwareTesting.loginURL));
        await expect(this.signInLink).toBeVisible();
    }

    async submitValidLoginAndVerifyAccount(email: string, password: string): Promise<void> {
        await this.emailField.clear();
        await this.passwordField.clear();
        await expect(this.emailField).toHaveValue(Constants.emptyValue);
        await expect(this.passwordField).toHaveValue(Constants.emptyValue);
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginButton.click();
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.PracticeSoftwareTesting.accountURL));
    }

    async loginAndVerifyAccount(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginButton.click();
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.PracticeSoftwareTesting.accountURL));
    }

    async verifyLoginFieldsVisible(): Promise<void> {
        await expect(this.emailField).toBeVisible();
        await expect(this.passwordField).toBeVisible();
    }

    async loginFavoritesAccount(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.favoritesPasswordField.fill(password);
        await this.loginButton.click();
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.PracticeSoftwareTesting.accountURL));
        await expect(this.page.getByRole('heading', { name: 'My account', exact: true })).toBeVisible();
    }

    async openFavoritesLoginPage(loginUrl: string): Promise<void> {
        await this.page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    }
}
