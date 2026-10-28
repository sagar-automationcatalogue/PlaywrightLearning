import { expect, Locator, Page } from "@playwright/test";
import { demoWebShopBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";

type DemoWebShopCategory = "books" | "computersURL" | "electronics" | "apparelShoes" |
    "digitalDownloads" | "jewelry" | "giftCards";

export class HeaderComponents {
    private readonly page: Page;
    private readonly logoLink: Locator;
    private readonly loginLink: Locator;
    private readonly accountLink: Locator;
    private readonly logoutLink: Locator;
    private readonly cartLink: Locator;
    private readonly wishlistLink: Locator;
    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly categoryLinks: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.logoLink = page.getByRole("link", { name: "Tricentis Demo Web Shop" });
        this.loginLink = page.getByRole("link", { name: "Log in", exact: true });
        this.accountLink = page.getByRole("link", { name: /@/, exact: true });
        this.logoutLink = page.getByRole("link", { name: "Log out", exact: true });
        this.cartLink = page.locator("#topcartlink").getByRole("link");
        this.wishlistLink = page.locator("#topwishlistlink").getByRole("link");
        this.searchInput = page.locator(".search-box").getByRole("textbox");
        this.searchButton = page.locator(".search-box").getByRole("button", { name: "Search", exact: true });
        const topMenu = page.locator(".top-menu");
        this.categoryLinks = {
            Books: topMenu.getByRole("link", { name: "Books", exact: true }),
            Computers: topMenu.getByRole("link", { name: "Computers", exact: true }),
            Electronics: topMenu.getByRole("link", { name: /^Electronics$/i }),
            "Apparel & Shoes": topMenu.getByRole("link", { name: /^Apparel & Shoes$/i }),
            "Digital Downloads": topMenu.getByRole("link", { name: /^Digital Downloads$/i }),
            Jewelry: topMenu.getByRole("link", { name: /^Jewelry$/i }),
            "Gift Cards": topMenu.getByRole("link", { name: /^Gift Cards$/i })
        };
    }

    async openHome(): Promise<void> {
        await this.logoLink.click();
        await expect(this.page).toHaveURL(demoWebShopBaseURL);
        await expect(this.page.getByRole("heading", {
            name: Constants.DemoWebShop.homeHeading,
            exact: true
        })).toBeVisible();
    }

    async openLogin(): Promise<void> {
        await this.loginLink.click();
        await expect(this.page).toHaveURL(
            joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.loginURL)
        );
    }

    async openAccount(): Promise<void> {
        await this.accountLink.click();
        await expect(this.page).toHaveURL(
            joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.accountURL)
        );
        await expect(this.page.getByRole("heading", {
            name: Constants.DemoWebShop.headings.account,
            exact: true
        })).toBeVisible();
    }

    async logout(): Promise<void> {
        await this.logoutLink.click();
        await expect(this.page).toHaveURL(demoWebShopBaseURL);
        await expect(this.loginLink).toBeVisible();
    }

    async verifyLoggedOutState(): Promise<void> {
        await expect(this.loginLink).toBeVisible();
        await expect(this.accountLink).toHaveCount(0);
    }

    async openCart(): Promise<void> {
        await this.cartLink.click();
        await expect(this.page).toHaveURL(
            joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.cart)
        );
        await expect(this.page.getByRole("heading", {
            name: Constants.DemoWebShop.shoppingCartHeading,
            exact: true
        })).toBeVisible();
    }

    async openWishlist(): Promise<void> {
        await this.wishlistLink.click();
        await expect(this.page).toHaveURL(
            joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.wishList)
        );
    }

    async getCartQuantity(): Promise<number> {
        const quantityText = await this.getCartQuantityText();
        const quantity = Number(quantityText.replace(/[^\d]/g, ""));
        if (!Number.isInteger(quantity)) {
            throw new Error(`Unable to read the shopping-cart quantity from "${quantityText}".`);
        }
        return quantity;
    }

    async getCartQuantityText(): Promise<string> {
        return this.page.locator("#topcartlink .cart-qty").innerText();
    }

    async searchStore(searchTerm: string): Promise<void> {
        await this.searchInput.fill(searchTerm);
        await expect(this.searchInput).toHaveValue(searchTerm);
        await this.searchButton.click();
        await expect(this.page).toHaveURL(new RegExp(
            `${URLConfig.UI.DemoWebShop.searchURL}\\?q=${encodeURIComponent(searchTerm)}`,
            "i"
        ));
        await expect(this.page.getByRole("heading", { name: "Search", exact: true })).toBeVisible();
        await expect(this.page.locator(".search-results")).toBeVisible();
    }

    private async openCategory(category: DemoWebShopCategory, linkName: string): Promise<void> {
        await this.categoryLinks[linkName].click();
        await expect(this.page).toHaveURL(
            joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop[category])
        );
        await expect(this.page.getByRole("heading", {
            name: new RegExp(`^${linkName}$`, "i"),
            exact: true
        })).toBeVisible();
    }

    async openBooks(): Promise<void> {
        await this.openCategory("books", "Books");
    }

    async openComputers(): Promise<void> {
        await this.openCategory("computersURL", "Computers");
    }

    async openElectronics(): Promise<void> {
        await this.openCategory("electronics", "Electronics");
    }

    async openApparelAndShoes(): Promise<void> {
        await this.openCategory("apparelShoes", "Apparel & Shoes");
    }

    async openDigitalDownloads(): Promise<void> {
        await this.openCategory("digitalDownloads", "Digital Downloads");
    }

    async openJewelry(): Promise<void> {
        await this.openCategory("jewelry", "Jewelry");
    }

    async openGiftCards(): Promise<void> {
        await this.openCategory("giftCards", "Gift Cards");
    }
}
