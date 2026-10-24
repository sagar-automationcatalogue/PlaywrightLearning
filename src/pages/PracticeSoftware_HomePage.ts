import { Page, Locator, expect } from '@playwright/test';
import { joinBaseURL } from '../config/EnvironmentConfig';
import { URLConfig } from '../config/URLConfig';

export class PracticeSoftware_HomePage {
    private mainNavigation: Locator;
    private mainMenu: Locator;
    private signInLink: Locator;
    private accountHeading: Locator;
    private accountMenuItem: Locator;
    private myAccountLink: Locator;
    private userMenuItem: Locator;
    private signOutOption: Locator;

    constructor(private page: Page) {
        this.mainMenu = page.getByRole('menubar', { name: 'Main menu' });
        this.mainNavigation = page.getByRole('navigation').filter({ has: this.mainMenu });
        this.signInLink = page.getByText('Sign in', { exact: true });
        this.accountHeading = page.getByRole('heading', { name: 'My account', exact: true });
        this.accountMenuItem = this.mainMenu.getByRole('menuitem').filter({ hasText: /Jane Doe|account/i });
        this.myAccountLink = page.getByRole('link', { name: /my account/i });
        this.userMenuItem = this.mainMenu.getByRole('menuitem').last();
        this.signOutOption = this.mainMenu.getByText('Sign out', { exact: true });
    }

    async openHomeAndVerifyShell(homeUrl: string): Promise<void> {
        await this.page.goto(homeUrl);
        await expect(this.page).toHaveTitle(/Practice Software Testing.*Toolshop/i);
        await expect(this.mainNavigation).toBeVisible();
        await expect(this.signInLink).toBeVisible();
    }

    async openHomeAndVerifyNavigation(homeUrl: string): Promise<void> {
        await this.page.goto(homeUrl);
        await expect(this.mainNavigation).toBeVisible();
    }

    async verifyAccountAndOpenAccountMenu(): Promise<void> {
        await expect(this.mainMenu).toBeVisible();
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.PracticeSoftwareTesting.accountURL));
        await expect(this.accountHeading).toBeVisible();
        await expect(this.accountMenuItem).toBeVisible();
        await this.accountMenuItem.click();
        await expect(this.myAccountLink).toBeVisible();
        await this.myAccountLink.click();
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.PracticeSoftwareTesting.accountURL));
        await expect(this.accountHeading).toBeVisible();
    }

    async returnHomeAndSignOut(homeUrl: string): Promise<void> {
        await this.page.goto(homeUrl);
        await expect(this.mainMenu).toBeVisible();
        await expect(this.userMenuItem).toBeVisible();
        await this.userMenuItem.getByRole('button').click();
        await expect(this.signOutOption).toBeVisible();
        await this.signOutOption.click();
    }

    async openProtectedAccountAndVerifyRedirect(homeUrl: string): Promise<void> {
        await expect(this.signInLink).toBeVisible();
        await this.page.goto(joinBaseURL(homeUrl, URLConfig.UI.PracticeSoftwareTesting.accountURL));
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.PracticeSoftwareTesting.loginURL));
    }
}
