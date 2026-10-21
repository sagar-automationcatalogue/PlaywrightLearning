import { expect, Locator, Page } from "@playwright/test";

export class AutomationExercise_HomePage {
    private page: Page;
    private homeLink: Locator;
    private productsLink: Locator;
    private cartLink: Locator;
    private signupLoginLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.getByRole("link", { name: "Home" });
        this.productsLink = page.locator("//a[text()=' Products']");
        this.cartLink = page.locator("//a[@href='/view_cart']").first();
        this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    }

    async openAndVerifyHomePage(): Promise<void> {
        await this.page.goto("https://www.automationexercise.com/");
        console.log("Home page is loaded successfully");
        await expect(this.homeLink).toBeVisible();
        await expect(this.productsLink).toBeVisible();
        await expect(this.cartLink).toBeVisible();
        await expect(this.signupLoginLink).toBeVisible();
        console.log("Home, Products, Cart and Signup/Login navigation are visible");
    }

    async openSignupLoginPage(): Promise<void> {
        await this.signupLoginLink.click();
    }

    async verifySignupLoginLinkVisible(): Promise<void> {
        await expect(this.signupLoginLink).toBeVisible();
    }
}
