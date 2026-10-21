import { expect, Locator, Page } from "@playwright/test";
import { TC_01_LoginScenarios, TC_02_DynamicRegistration } from "../../test-data/expnadTesting";

export class ExpandTesting_LoginPage {
    private page: Page;
    private readonly loginUrl = "https://practice.expandtesting.com/login";
    private readonly secureUrl = "https://practice.expandtesting.com/secure";
    private usernameField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;
    private loginAlert: Locator;
    private loginSuccessMessage: Locator;
    private logoutButton: Locator;
    private secureAreaHeading: Locator;
    private logoutMessage: Locator;
    private dynamicRegistrationLoginButton: Locator;
    private dynamicRegistrationLogoutButton: Locator;
    private dynamicRegistrationSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.getByRole("textbox", { name: "Username" });
        this.passwordField = page.getByRole("textbox", { name: "Password" });
        this.loginButton = page.getByRole("button", { name: "Login" });
        this.loginAlert = page.getByRole("alert");
        this.loginSuccessMessage = page.getByText("You logged into a secure area!", { exact: true });
        this.logoutButton = page.getByRole("link", { name: "Logout" });
        this.secureAreaHeading = page.getByRole("heading", { name: "Hi, practice!" });
        this.logoutMessage = page.getByText("You logged out of the secure area!", { exact: true });
        this.dynamicRegistrationLoginButton = page.getByRole("button", { name: "Login" });
        this.dynamicRegistrationLogoutButton = page.getByRole("link", { name: "Logout" });
        this.dynamicRegistrationSuccessMessage = page.getByText(
            TC_02_DynamicRegistration.messages.loginSuccess
        );
    }

    async openLoginPage(): Promise<void> {
        console.log("Opening the ExpandTesting Login page");
        await this.page.goto(this.loginUrl);
        await expect(this.page).toHaveURL(this.loginUrl);
        await expect(this.page.getByRole("heading").first()).toBeVisible();

        await expect(this.usernameField).toBeVisible();
        await expect(this.usernameField).toBeEnabled();
        await expect(this.passwordField).toBeVisible();
        await expect(this.passwordField).toBeEnabled();
        await expect(this.loginButton).toBeVisible();
        await expect(this.loginButton).toBeEnabled();
        console.log("Login heading, fields, and button are available");
    }

    async submitInvalidUsernameAndVerifyRejection(): Promise<void> {
        await this.usernameField.fill(TC_01_LoginScenarios.invalidUsername);
        await expect(this.usernameField).toHaveValue(TC_01_LoginScenarios.invalidUsername);
        await this.passwordField.fill(TC_01_LoginScenarios.validPassword);
        await expect(this.passwordField).toHaveValue(TC_01_LoginScenarios.validPassword);
        await this.loginButton.click();

        await expect(this.loginAlert).toHaveText(/Your password is invalid!/i);
        await expect(this.page).toHaveURL(this.loginUrl);
        console.log("Invalid username was rejected");
    }

    async submitValidUsernameWithInvalidPasswordAndVerifyProtectedArea(): Promise<void> {
        await this.clearCredentials();

        await this.usernameField.fill(TC_01_LoginScenarios.validUsername);
        await expect(this.usernameField).toHaveValue(TC_01_LoginScenarios.validUsername);
        await this.passwordField.fill(TC_01_LoginScenarios.invalidPassword);
        await expect(this.passwordField).toHaveValue(TC_01_LoginScenarios.invalidPassword);
        await this.loginButton.click();

        await expect(this.loginAlert).toHaveText(/Your password is invalid!/i);
        await expect(this.page).toHaveURL(this.loginUrl);
        await this.page.goto(this.secureUrl);
        await expect(this.page).toHaveURL(this.loginUrl);
        await expect(this.loginButton).toBeVisible();
        console.log("Invalid password was rejected and the secure page remained protected");
    }

    async submitValidCredentialsAndVerifyAuthenticatedState(): Promise<void> {
        await this.clearCredentials();

        await this.usernameField.fill(TC_01_LoginScenarios.validUsername);
        await expect(this.usernameField).toHaveValue(TC_01_LoginScenarios.validUsername);
        await this.passwordField.fill(TC_01_LoginScenarios.validPassword);
        await expect(this.passwordField).toHaveValue(TC_01_LoginScenarios.validPassword);
        await this.loginButton.click();
        console.log("Submitting valid login credentials");

        await expect(this.page).toHaveURL(/\/secure/);
        await expect(this.loginSuccessMessage).toBeVisible();
        await expect(this.logoutButton).toBeVisible();

        await this.page.reload();
        await expect(this.page).toHaveURL(/\/secure/);
        await expect(this.secureAreaHeading).toBeVisible();
        await expect(this.logoutButton).toBeVisible();
        console.log("Authenticated state remains after refreshing the secure page");
    }

    async logoutAndVerifyUserRemainsLoggedOut(): Promise<void> {
        await this.logoutButton.click();
        await expect(this.page).toHaveURL(this.loginUrl);
        await expect(this.loginButton).toBeVisible();
        if (await this.logoutMessage.count()) {
            await expect(this.logoutMessage).toBeVisible();
        }

        await this.page.goBack();
        await expect(this.page).toHaveURL(this.loginUrl);
        await expect(this.loginButton).toBeVisible();
        await expect(this.loginSuccessMessage).toHaveCount(0);
        await expect(this.logoutButton).toHaveCount(0);
        console.log("Browser Back did not restore the authenticated state");
    }

    private async clearCredentials(): Promise<void> {
        await this.usernameField.fill("");
        await this.passwordField.fill("");
        await expect(this.usernameField).toHaveValue("");
        await expect(this.passwordField).toHaveValue("");
    }

    async loginWithRegisteredUser(username: string): Promise<void> {
        await this.usernameField.fill(username);
        await expect(this.usernameField).toHaveValue(username);
        await this.passwordField.fill(TC_02_DynamicRegistration.registrationPassword);
        await expect(this.passwordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
        await this.dynamicRegistrationLoginButton.click();
        await expect(this.page).toHaveURL(this.secureUrl);
        await expect(this.dynamicRegistrationSuccessMessage).toBeVisible();
        await expect(this.dynamicRegistrationLogoutButton).toBeVisible();
        console.log("First login successful");
    }

    async logoutAndVerifyLoginPage(): Promise<void> {
        await this.dynamicRegistrationLogoutButton.click();
        await expect(this.page).toHaveURL(this.loginUrl);
        await expect(this.usernameField).toBeVisible();
        await expect(this.passwordField).toBeVisible();
        console.log("First logout successful");
    }

    async loginAgainAndLogout(username: string): Promise<void> {
        await this.usernameField.fill(username);
        await expect(this.usernameField).toHaveValue(username);
        await this.passwordField.fill(TC_02_DynamicRegistration.registrationPassword);
        await expect(this.passwordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
        await this.dynamicRegistrationLoginButton.click();
        await expect(this.page).toHaveURL(this.secureUrl);
        await expect(this.dynamicRegistrationSuccessMessage).toBeVisible();
        console.log("Second login successful");

        await this.dynamicRegistrationLogoutButton.click();
        await expect(this.page).toHaveURL(this.loginUrl);
        await expect(this.usernameField).toBeVisible();
        await expect(this.dynamicRegistrationLogoutButton).toHaveCount(0);
        console.log("Final logout successful");
    }
}
