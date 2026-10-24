import { Page, Locator, expect } from '@playwright/test';
import { TC_01_LoginMatrix } from '../../test-data/sauceDemo';
import { sauceDemoBaseURL } from "../config/EnvironmentConfig";
import { Constants } from '../constants/constants';

export class SauceDemo_LoginPage {
    private usernameInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private errorMessage: Locator;
    private dismissErrorButton: Locator;

    constructor(private page: Page) {
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.getByLabel('Password').nth(0);
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('[data-test="error"]');
        this.dismissErrorButton = page.locator('xpath=//button[@class="error-button"]');
    }

    async openLoginPage(): Promise<void> {
        await this.page.goto(sauceDemoBaseURL);
    }

    async reloadLoginPage(): Promise<void> {
        await this.page.reload();
    }

    async verifyLoginFormUsable(): Promise<void> {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
        console.log('Login form is usable');
        await expect(this.passwordInput).toHaveAttribute('type', 'password');
        console.log('Password control has password semantics');
    }

    async submitEmptyLoginAndVerify(): Promise<void> {
        await this.loginButton.click();
        await expect(this.errorMessage).toHaveText(Constants.SauceDemo.errors.usernameRequired);
    }

    async submitPasswordWithoutUsernameAndVerify(password: string): Promise<void> {
        await expect(this.usernameInput).toHaveText('');
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await expect(this.errorMessage).toHaveText(Constants.SauceDemo.errors.usernameRequired);
    }

    async dismissLoginError(): Promise<void> {
        await this.dismissErrorButton.click();
    }

    async populateUsernameAndVerify(username: string): Promise<void> {
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
    }

    async submitWithoutPasswordAndVerify(username: string, emptyValue: string, expectedError: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(emptyValue);
        await this.loginButton.click();
        await expect(this.errorMessage).toHaveText(expectedError);
    }

    async clearCredentialsAndVerify(emptyValue: string): Promise<void> {
        await this.usernameInput.clear();
        await expect(this.usernameInput).toHaveValue(emptyValue);
        await this.passwordInput.clear();
        await expect(this.passwordInput).toHaveValue(emptyValue);
    }

    async submitInvalidCredentialsAndVerify(username: string, password: string, expectedError: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await expect(this.errorMessage).toHaveText(expectedError);
    }

    async submitLockedCredentialsAndVerify(username: string, password: string, expectedError: string): Promise<void> {
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
        await this.passwordInput.fill(password);
        await expect(this.passwordInput).toHaveValue(password);
        await this.loginButton.click();
        await expect(this.errorMessage).toHaveText(expectedError);
    }

    async populateLockedCredentialsAndVerify(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
        await this.passwordInput.fill(password);
        await expect(this.passwordInput).toHaveValue(password);
    }

    async submitValidCredentials(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyProtectedRouteDenied(expectedError: string): Promise<void> {
        await expect(this.errorMessage).toHaveText(expectedError);
    }
}
