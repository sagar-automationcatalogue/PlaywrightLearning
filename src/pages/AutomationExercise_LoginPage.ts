import { expect, Locator, Page } from "@playwright/test";
import { TC_01_ValidateLogin } from "../../test-data/automationExercise";

export class AutomationExercise_LoginPage {
    private page: Page;
    private loginForm: Locator;
    private newUserSignup: Locator;
    private emailField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;
    private loginError: Locator;
    private loggedInAs: Locator;
    private logoutLink: Locator;
    private signupLoginLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginForm = page.getByText("Login to your account");
        this.newUserSignup = page.getByText("New User Signup!");
        this.emailField = page.locator("//input[@data-qa='login-email']");
        this.passwordField = page.locator("//input[@data-qa='login-password']");
        this.loginButton = page.locator("//button[@data-qa='login-button']");
        this.loginError = page.getByText(TC_01_ValidateLogin.loginError);
        this.loggedInAs = page.getByText("Logged in as");
        this.logoutLink = page.getByText("Logout");
        this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    }

    async verifyLoginForm(): Promise<void> {
        await expect(this.loginForm).toBeVisible();
        await expect(this.newUserSignup).toBeVisible();
        console.log("Signup/Login page opened successfully");
        await expect(this.emailField).toBeVisible();
        await expect(this.emailField).toBeEnabled();
        await expect(this.passwordField).toBeVisible();
        await expect(this.passwordField).toBeEnabled();
        console.log("Email and password fields are visible and enabled");
    }

    async submitInvalidCredentialsAndVerifyError(): Promise<void> {
        await this.emailField.fill(TC_01_ValidateLogin.email);
        expect(await this.emailField.inputValue()).toBe(TC_01_ValidateLogin.email);
        console.log("Registered email entered successfully");

        await this.passwordField.fill(TC_01_ValidateLogin.wrongPassword);
        expect(await this.passwordField.inputValue()).toBe(TC_01_ValidateLogin.wrongPassword);
        console.log("Invalid password entered");

        await this.loginButton.click();
        console.log("Login submitted with invalid password");
        await expect(this.loginError).toBeVisible();
        console.log("Invalid login error is displayed");
        expect(this.page.url()).toContain("/login");
        console.log("User remains on the Login page");
    }

    async submitValidCredentialsAndVerifyLogin(): Promise<void> {
        await this.emailField.fill(TC_01_ValidateLogin.emptyValue);
        await this.passwordField.fill(TC_01_ValidateLogin.emptyValue);
        expect(await this.emailField.inputValue()).toBe(TC_01_ValidateLogin.emptyValue);
        expect(await this.passwordField.inputValue()).toBe(TC_01_ValidateLogin.emptyValue);
        console.log("Email and password fields are cleared");

        await this.emailField.fill(TC_01_ValidateLogin.email);
        expect(await this.emailField.inputValue()).toBe(TC_01_ValidateLogin.email);
        console.log("Registered email entered again successfully");

        await this.passwordField.fill(TC_01_ValidateLogin.password);
        expect(await this.passwordField.inputValue()).toBe(TC_01_ValidateLogin.password);
        console.log("Valid password entered successfully");

        await this.loginButton.click();
        console.log("Login submitted with valid credentials");
        await expect(this.loggedInAs).toBeVisible();
        console.log("Logged in as is visible");
        await expect(this.logoutLink).toBeVisible();
        console.log("Logout navigation is visible");
    }

    async verifyLoggedInAsVisible(): Promise<void> {
        await expect(this.loggedInAs).toBeVisible();
        console.log("Authenticated navigation state is shown");
    }

    async logoutAndVerifyProtectedState(): Promise<void> {
        await this.page.locator('//a[contains(@href, "/logout")]').click();
        console.log("Logout clicked");
        await expect(this.signupLoginLink).toBeVisible();
        await expect(this.page).toHaveURL("https://www.automationexercise.com/login");
        await expect(this.loginForm).toBeVisible();
        console.log("User is navigated to login page and Login form is displayed");
        await expect(this.loggedInAs).not.toBeVisible();
        console.log("Authentication state is removed");

        await this.page.goBack();
        console.log("Browser Back navigation performed");
        await expect(this.loggedInAs).not.toBeVisible();
        await expect(this.signupLoginLink).toBeVisible();
        console.log("Logged-out state remains after browser back");
    }
}
