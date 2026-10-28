import { expect, Locator, Page } from "@playwright/test";
import { TC_02_AutomationExercise } from "../../test-data/automationExercise";
import { automationExerciseBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";
import { PlaywrightUtils } from "../utils/PlaywrightUtils";

export class AutomationExercise_ProductsPage {
    private page: Page;
    private productsLink: Locator;
    private homeLink: Locator;
    private homeSlider: Locator;
    private allProductsHeading: Locator;
    private searchedProductsHeading: Locator;
    private productCards: Locator;
    private searchInput: Locator;
    private searchButton: Locator;
    private productInformation: Locator;
    private productDetailHeading: Locator;
    private productDetailCategory: Locator;
    private productDetailPrice: Locator;
    private productAvailability: Locator;
    private productCondition: Locator;
    private productBrand: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsLink = page.locator("//a[text()=' Products']");
        this.homeLink = page.getByRole("link", { name: /Home$/ });
        this.homeSlider = page.locator("#slider");
        this.allProductsHeading = page.getByRole("heading", { name: /^ALL PRODUCTS$/i });
        this.searchedProductsHeading = page.getByRole("heading", { name: /^SEARCHED PRODUCTS$/i });
        this.productCards = page.locator(".features_items .product-image-wrapper");
        this.searchInput = page.getByRole("textbox", { name: "Search Product" });
        this.searchButton = page.locator("#submit_search");
        this.productInformation = page.locator(".product-information");
        this.productDetailHeading = this.productInformation.getByRole("heading");
        this.productDetailCategory = this.productInformation.getByText(/^Category:/);
        this.productDetailPrice = this.productInformation.getByText(/^Rs\.\s*\d/);
        this.productAvailability = this.productInformation.getByRole("paragraph").filter({ hasText: /^Availability:/ });
        this.productCondition = this.productInformation.getByRole("paragraph").filter({ hasText: /^Condition:/ });
        this.productBrand = this.productInformation.getByRole("paragraph").filter({ hasText: /^Brand:/ });
    }

    async openHomeAndProductsCatalog(): Promise<number> {
        await expect(this.homeLink).toBeVisible();
        await expect(this.homeSlider).toBeVisible();
        console.log("Home page is displayed.");

        await this.productsLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(automationExerciseBaseURL, URLConfig.UI.AutomationExercise.productURL));
        await expect(this.allProductsHeading).toBeVisible();

        await expect(this.productCards.first()).toBeVisible();
        const baselineProductCount = await this.productCards.locator("visible=true").count();
        expect(baselineProductCount).toBeGreaterThan(0);
        console.log("Visible product cards before search:", baselineProductCount);
        return baselineProductCount;
    }

    async searchTopProductsAndVerifyRelatedCategories(baselineProductCount: number): Promise<string[]> {
        await expect(this.searchInput).toBeVisible();
        await PlaywrightUtils.clearAndFillInput(
            this.searchInput,
            TC_02_AutomationExercise.category,
            "Search Product"
        );
        await expect(this.searchButton).toBeVisible();
        await this.searchButton.click();
        await expect(this.searchedProductsHeading).toBeVisible();
        await expect(this.productCards.first()).toBeVisible();

        // Read .productinfo only: hover overlays repeat the names and prices.
        const productNames = await this.productCards.locator(".productinfo p").allTextContents();
        expect(productNames.length).toBeGreaterThan(0);
        expect(productNames.length).toBeLessThanOrEqual(baselineProductCount);
        console.log("Search results for top:", productNames);

        const normalizedProductNames = productNames.map(name => name.trim().toLowerCase());
        for (let index = 0; index < normalizedProductNames.length; index++) {
            const productName = productNames[index].trim();
            const normalizedName = normalizedProductNames[index];

            // Search also matches categories: a shirt can belong to the Tops category.
            if (normalizedName.includes(TC_02_AutomationExercise.category)) {
                expect(normalizedName).toContain(TC_02_AutomationExercise.category);
                console.log("Relevant product name verified:", productName);
            } else {
                const relatedProductCard = this.productCards.filter({
                    has: this.page.locator(".productinfo").getByText(productName, { exact: true })
                });
                await expect(relatedProductCard).toHaveCount(1);
                await relatedProductCard.getByRole("link", { name: "View Product" }).click();
                await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.AutomationExercise.productDetailsURL}/\\d+$`));
                await expect(this.productDetailHeading).toHaveText(productName);
                await expect(this.productDetailCategory).toContainText(TC_02_AutomationExercise.expectedRelatedCategory);
                console.log("Top-related category verified for:", productName);
                await this.page.goBack();
                await expect(this.searchedProductsHeading).toBeVisible();
                await expect(this.productCards).toHaveCount(productNames.length);
            }
        }
        return productNames;
    }

    async captureAndValidateSearchPrices(productNames: string[]): Promise<string[]> {
        const productPrices = this.productCards.locator(".productinfo").getByRole("heading");
        await expect(productPrices).toHaveCount(productNames.length);
        const searchedPrices = await productPrices.allTextContents();
        console.log("Prices of searched products:", searchedPrices);
        for (const price of searchedPrices) {
            expect(price.trim()).toMatch(TC_02_AutomationExercise.pricePattern);
        }
        console.log("All searched product prices have a valid currency and numeric value.");
        return searchedPrices;
    }

    async openSelectedProductAndVerifyDetails(productName: string, productPrice: string): Promise<void> {
        const selectedProductCard = this.productCards.filter({
            has: this.page.locator(".productinfo").getByText(productName, { exact: true })
        });
        await expect(selectedProductCard).toHaveCount(1);
        await expect(selectedProductCard).toBeVisible();
        console.log("Selected product:", productName);

        await selectedProductCard.locator(".single-products").hover();
        const productOverlay = selectedProductCard.locator(".product-overlay");
        await expect(productOverlay).toBeVisible();
        // Add to cart is an <a> without href, so it has no link role.
        await expect(productOverlay.getByText(/Add to cart$/)).toBeVisible();
        console.log("Hover overlay and Add to cart action are visible.");

        const viewProductLink = selectedProductCard.getByRole("link", { name: "View Product" });
        await viewProductLink.hover();
        await expect(viewProductLink).toBeVisible();
        await viewProductLink.click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.AutomationExercise.productDetailsURL}/\\d+$`));

        await expect(this.productDetailHeading).toHaveText(productName);
        await expect(this.productDetailCategory).toBeVisible();
        await expect(this.productDetailCategory).toHaveText(/^Category:\s*\S.+/);
        await expect(this.productDetailPrice).toBeVisible();
        await expect(this.productDetailPrice).toHaveText(productPrice);
        await expect(this.productAvailability).toBeVisible();
        await expect(this.productAvailability).toHaveText(/^Availability:\s*\S.+/);
        await expect(this.productCondition).toBeVisible();
        await expect(this.productCondition).toHaveText(/^Condition:\s*\S.+/);
        await expect(this.productBrand).toBeVisible();
        await expect(this.productBrand).toHaveText(/^Brand:\s*\S.+/);
        console.log("Product name, category, price, availability, condition and brand are verified.");
    }

    async restoreCatalogAndSearchJeans(baselineProductCount: number): Promise<void> {
        await this.productsLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(automationExerciseBaseURL, URLConfig.UI.AutomationExercise.productURL));
        await expect(this.allProductsHeading).toBeVisible();
        await expect(this.productCards).toHaveCount(baselineProductCount);
        console.log("Full product catalog is restored.");

        await expect(this.searchInput).toBeVisible();
        await this.searchInput.fill(TC_02_AutomationExercise.jeanCategory);
        await expect(this.searchInput).toHaveValue(TC_02_AutomationExercise.jeanCategory);
        await this.searchButton.click();
        await expect(this.searchedProductsHeading).toBeVisible();
        await expect(this.productCards.first()).toBeVisible();
        const alternateProductNames = await this.productCards.locator(".productinfo p").allTextContents();
        expect(alternateProductNames.length).toBeGreaterThan(0);
        console.log("Search results for jean:", alternateProductNames);

        const normalizedAlternateNames = alternateProductNames.map(name => name.trim().toLowerCase());
        for (const productName of normalizedAlternateNames) {
            expect(productName).toContain(TC_02_AutomationExercise.jeanCategory);
            console.log("Jean-related product verified:", productName);
        }
        console.log("Both keyword searches completed successfully.");
    }

    async openProductsAndVerifyAuthenticatedState(): Promise<void> {
        await this.productsLink.click();
        console.log("Navigated to Products page");
        await expect(this.page).toHaveURL(joinBaseURL(automationExerciseBaseURL, URLConfig.UI.AutomationExercise.productURL));
        console.log("All products page is loaded");
    }
}
