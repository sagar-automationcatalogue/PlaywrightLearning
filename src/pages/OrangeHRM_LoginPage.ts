import { Page, Locator, expect } from "@playwright/test";
import { OrangeHRM_Data, TC_01_LoginOrangeHrm } from '../../test-data/orangeHRM';
import { orangeHRMBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";

export class OrangeHRM_LoginPage{
    page: Page;
    usernameInput:Locator;
    pwdInput: Locator;
    loginBtn: Locator;
    private formHeader: Locator;
    private errorMessage: Locator;
    private dashboardText: Locator;
    private logoutText: Locator;
    private usernamePlaceholderInput: Locator;
    private passwordPlaceholderInput: Locator;

    constructor(page: Page){
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: /Username/i });
        this.pwdInput = page.getByRole('textbox', { name: /Password/i });
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.formHeader = page.locator('.form-header');
        this.errorMessage = page.locator('.toast-message');
        this.dashboardText = page.getByText(Constants.OrangeHRM.dashboardText, { exact: true });
        this.logoutText = page.getByText('Log Out').first();
        this.usernamePlaceholderInput = page.getByPlaceholder('Username');
        this.passwordPlaceholderInput = page.getByPlaceholder('Password');
    }

    async openLoginPage(): Promise<void>{
        await this.page.goto(orangeHRMBaseURL, { waitUntil: 'domcontentloaded' });
    }

    async loginAt(baseUrl: string, username: string, password: string): Promise<void>{
        await this.page.goto(baseUrl);
        await this.usernamePlaceholderInput.fill(username);
        await this.passwordPlaceholderInput.fill(password);
        await this.loginBtn.click();
    }

    async verifyDashboardLoaded(): Promise<void>{
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.OrangeHRM.dashboardPathURL));
    }

    async logoutAndVerifyLoginPage(): Promise<void>{
        await this.logoutText.click();
        await expect(this.usernamePlaceholderInput).toBeVisible();
    }

    async verifyLoginRejected(errorPattern: RegExp): Promise<void>{
        await expect(this.page).not.toHaveURL(new RegExp(URLConfig.UI.OrangeHRM.dashboardPathURL));
        await expect(this.page.getByText(errorPattern)).toBeVisible();
    }

    async verifyLoginFormVisible(): Promise<void>{
        console.log('Step 1.2: Verify the login form is displayed');
        await expect(this.usernameInput).toBeVisible();
    }

    async verifyLoginControls(): Promise<void>{
        await expect(this.formHeader).toBeVisible();
        await expect(this.usernameInput).toBeVisible();
        await expect(this.usernameInput).toBeEnabled();
        await expect(this.pwdInput).toBeVisible();
        await expect(this.pwdInput).toBeEnabled();
        await expect(this.loginBtn).toBeVisible();
        await expect(this.loginBtn).toBeEnabled();
    }

    async verifyLoginPageHeader(): Promise<void>{
        await expect(this.formHeader).toBeVisible({ timeout: 20000 });
    }

    async loginWithCredentials(username: string, password: string): Promise<void>{
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
        await this.pwdInput.fill(password);
        await expect(this.pwdInput).toHaveValue(password);
        await this.loginBtn.click({ noWaitAfter: true });
    }

    async verifyInvalidLogin(invalidCredentialsPattern: RegExp): Promise<void>{
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(invalidCredentialsPattern);
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.OrangeHRM.retryLoginURL, 'i'));
        await expect(this.loginBtn).toBeVisible();
        await expect(this.dashboardText).toHaveCount(0);
    }

    async verifyCredentialsCleared(emptyValue: string): Promise<void>{
        await expect(this.usernameInput).toHaveValue(emptyValue);
        await expect(this.pwdInput).toHaveValue(emptyValue);
    }

    async verifyLoggedOut(): Promise<void>{
        await expect(this.page).toHaveURL(new RegExp(
            `${URLConfig.UI.OrangeHRM.loginURL}|${URLConfig.UI.OrangeHRM.seamlessLoginURL}`,
            'i'
        ));
        await expect(this.loginBtn).toBeVisible();
        await expect(this.usernameInput).toBeVisible();
        await expect(this.pwdInput).toBeVisible();
    }

    async login(){
        await this.usernameInput.fill(OrangeHRM_Data.username);
        await this.pwdInput.fill(OrangeHRM_Data.pwd)
        await this.loginBtn.click();
    }
}
