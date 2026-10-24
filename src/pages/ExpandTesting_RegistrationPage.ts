import { expect, Locator, Page } from "@playwright/test";
import { TC_02_DynamicRegistration } from "../../test-data/expnadTesting";
import { expandTestingBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";

export class ExpandTesting_RegistrationPage {
    private page: Page;
    private readonly registrationUrl = joinBaseURL(expandTestingBaseURL, URLConfig.UI.ExpandTesting.registrationURL);
    private readonly loginUrl = joinBaseURL(expandTestingBaseURL, URLConfig.UI.ExpandTesting.loginURL);
    private usernameField: Locator;
    private passwordField: Locator;
    private confirmPasswordField: Locator;
    private registerButton: Locator;
    private requiredFieldsMessage: Locator;
    private passwordMismatchMessage: Locator;
    private registrationSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.getByLabel("Username");
        this.passwordField = page.getByLabel("Password", { exact: true });
        this.confirmPasswordField = page.getByLabel("Confirm Password");
        this.registerButton = page.getByRole("button", { name: "Register" });
        this.requiredFieldsMessage = page.getByText(Constants.ExpandTesting.messages.requiredFields);
        this.passwordMismatchMessage = page.getByText(Constants.ExpandTesting.messages.passwordsDoNotMatch);
        this.registrationSuccessMessage = page.getByText(Constants.ExpandTesting.messages.registrationSuccess);
    }

    async openRegistrationPageAndVerifyControls(): Promise<void> {
        await this.page.goto(this.registrationUrl);
        await expect(this.page).toHaveURL(this.registrationUrl);
        await expect(this.usernameField).toBeVisible();
        await expect(this.passwordField).toBeVisible();
        await expect(this.confirmPasswordField).toBeVisible();
        await expect(this.registerButton).toBeVisible();

        await expect(this.usernameField).toHaveValue(Constants.emptyValue);
        await expect(this.passwordField).toHaveValue(Constants.emptyValue);
        await expect(this.confirmPasswordField).toHaveValue(Constants.emptyValue);
    }

    async submitEmptyFormAndVerifyRequiredFields(): Promise<void> {
        await this.registerButton.click();
        await expect(this.requiredFieldsMessage).toBeVisible();
        console.log("Required-field validation verified");
    }

    async submitUsernameWithoutPasswordAndVerifyRequiredFields(): Promise<string> {
        Constants.ExpandTesting.username =
            `${TC_02_DynamicRegistration.usernamePrefix}${Date.now()}`;
        console.log(`Generated registration username: ${Constants.ExpandTesting.username}`);

        await this.usernameField.fill(Constants.ExpandTesting.username);
        await this.confirmPasswordField.fill(TC_02_DynamicRegistration.registrationPassword);
        await expect(this.usernameField).toHaveValue(Constants.ExpandTesting.username);
        await expect(this.passwordField).toHaveValue(Constants.emptyValue);
        await expect(this.confirmPasswordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
        await this.registerButton.click();
        await expect(this.requiredFieldsMessage).toBeVisible();
        console.log("Missing-password validation verified");
        return Constants.ExpandTesting.username;
    }

    async clearFieldsAndVerifyReset(): Promise<void> {
        await this.usernameField.fill(Constants.emptyValue);
        await this.passwordField.fill(Constants.emptyValue);
        await this.confirmPasswordField.fill(Constants.emptyValue);
        await expect(this.usernameField).toHaveValue(Constants.emptyValue);
        await expect(this.passwordField).toHaveValue(Constants.emptyValue);
        await expect(this.confirmPasswordField).toHaveValue(Constants.emptyValue);
    }

    async submitMismatchedPasswordsAndVerifyError(username: string): Promise<void> {
        await this.usernameField.fill(username);
        await this.passwordField.fill(TC_02_DynamicRegistration.registrationPassword);
        await this.confirmPasswordField.fill(TC_02_DynamicRegistration.mismatchPassword);
        await expect(this.usernameField).toHaveValue(username);
        await expect(this.passwordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
        await expect(this.confirmPasswordField).toHaveValue(TC_02_DynamicRegistration.mismatchPassword);
        await this.registerButton.click();
        await expect(this.passwordMismatchMessage).toBeVisible();
        console.log("Password mismatch validation verified");
    }

    async correctConfirmationAndRegister(username: string): Promise<void> {
        await this.usernameField.fill(username);
        await this.passwordField.fill(TC_02_DynamicRegistration.registrationPassword);
        await this.confirmPasswordField.fill(TC_02_DynamicRegistration.registrationPassword);
        await expect(this.usernameField).toHaveValue(username);
        await expect(this.passwordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
        await expect(this.confirmPasswordField).toHaveValue(TC_02_DynamicRegistration.registrationPassword);
        await this.registerButton.click();
        await expect(this.page).toHaveURL(this.loginUrl);
        await expect(this.registrationSuccessMessage).toBeVisible();
        console.log("Registration successful");
    }
}
