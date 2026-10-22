import { Page, Locator, expect } from '@playwright/test';

export class SauceDemo_InventoryPage {
    private productsHeading: Locator;
    private menuButton: Locator;
    private shoppingCartLink: Locator;
    private logoutLink: Locator;

    constructor(private page: Page) {
        this.productsHeading = page.locator('xpath=//span[text()="Products"]');
        this.menuButton = page.locator('//button[@id="react-burger-menu-btn"]');
        this.shoppingCartLink = page.locator('//a[@class="shopping_cart_link"]');
        this.logoutLink = page.locator('//a[@id="logout_sidebar_link"]');
    }

    async verifyInventoryLoaded(): Promise<void> {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(this.productsHeading).toBeVisible();
        await expect(this.menuButton).toBeVisible();
        await expect(this.shoppingCartLink).toBeVisible();
        console.log('Authenticated application shell is present');
    }

    async logout(): Promise<void> {
        await this.menuButton.click();
        await this.logoutLink.click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }
}
