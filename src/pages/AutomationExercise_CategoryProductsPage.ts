import { expect, Locator, Page } from "@playwright/test";
import { TC_03_CategoryProducts } from "../../test-data/automationExercise";
import { automationExerciseBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";

export class AutomationExercise_CategoryProductsPage {
    private page: Page;
    private categories: Locator;
    private categoryHeading: Locator;
    private brands: Locator;
    private brandsHeading: Locator;
    private womenCategoryLink: Locator;
    private menCategoryLink: Locator;
    private kidsCategoryLink: Locator;
    private womenPanel: Locator;
    private menPanel: Locator;
    private womenDressLink: Locator;
    private womenTopsLink: Locator;
    private womenSareeLink: Locator;
    private menJeansLink: Locator;
    private productNames: Locator;
    private productsNavLink: Locator;
    private allProductsHeading: Locator;
    private poloLink: Locator;
    private hmLink: Locator;
    private poloProductsHeading: Locator;
    private hmProductsHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.categories = page.locator("#accordian");
        this.categoryHeading = page.getByRole("heading", { name: "Category", exact: true });
        this.brands = page.locator(".brands_products");
        this.brandsHeading = this.brands.getByRole("heading", { name: "Brands", exact: true });
        this.womenCategoryLink = this.categories.getByRole("link", { name: /Women$/i });
        this.menCategoryLink = this.categories.getByRole("link", { name: /\bMen$/i });
        this.kidsCategoryLink = this.categories.getByRole("link", { name: /Kids$/i });
        this.womenPanel = page.locator("#Women");
        this.menPanel = page.locator("#Men");
        this.womenDressLink = this.womenPanel.getByRole("link", { name: "Dress", exact: true });
        this.womenTopsLink = this.womenPanel.getByRole("link", { name: "Tops", exact: true });
        this.womenSareeLink = this.womenPanel.getByRole("link", { name: "Saree", exact: true });
        this.menJeansLink = this.menPanel.getByRole("link", { name: "Jeans", exact: true });
        this.productNames = page.locator(".features_items .productinfo p");
        this.productsNavLink = page.getByRole("banner").getByRole("link", { name: /Products$/ });
        this.allProductsHeading = page.getByRole("heading", { name: /^All Products$/i });
        this.poloLink = this.brands.getByRole("link", { name: /Polo$/ });
        this.hmLink = this.brands.getByRole("link", { name: /H&M$/ });
        this.poloProductsHeading = page.getByRole("heading", { name: /^Brand - Polo Products$/i });
        this.hmProductsHeading = page.getByRole("heading", { name: /^Brand - H&M Products$/i });
    }

    async openHomeAndVerifyCategoryAndBrandSidebars(): Promise<void> {
        await expect(this.categories).toBeVisible();
        await expect(this.categoryHeading).toBeVisible();
        await expect(this.brands).toBeVisible();
        await expect(this.brandsHeading).toBeVisible();
        await expect(this.womenCategoryLink).toBeVisible();
        await expect(this.menCategoryLink).toBeVisible();
        await expect(this.kidsCategoryLink).toBeVisible();
        console.log("Home page, Women, Men, Kids and Brands are visible.");
    }

    async selectWomenTopsAndCaptureProducts(): Promise<string> {
        await this.womenCategoryLink.click();
        await expect(this.womenPanel).toBeVisible();
        await expect(this.womenDressLink).toBeVisible();
        await expect(this.womenTopsLink).toBeVisible();
        await expect(this.womenSareeLink).toBeVisible();
        console.log("Women subcategories Dress, Tops and Saree are visible.");

        await this.womenTopsLink.click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.AutomationExercise.categoryProductsURL}/\\d+$`));
        await expect(this.page.getByRole("heading", { name: /^Women - Tops Products$/i })).toBeVisible();

        await expect(this.productNames.first()).toBeVisible();
        const womenProductNames = await this.productNames.allTextContents();
        expect(womenProductNames.length).toBeGreaterThan(0);
        const womenTopsUrl = this.page.url();
        console.log("Women Tops products:", womenProductNames);
        console.log("Women Tops URL:", womenTopsUrl);
        return womenTopsUrl;
    }

    async selectMenJeansAndVerifyDifferentCategory(womenTopsUrl: string): Promise<void> {
        await this.menCategoryLink.click();
        await expect(this.menPanel).toBeVisible();
        await expect(this.menJeansLink).toBeVisible();
        await this.menJeansLink.click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.AutomationExercise.categoryProductsURL}/\\d+$`));
        await expect(this.page.getByRole("heading", { name: /^Men - Jeans Products$/i })).toBeVisible();
        const menJeansUrl = this.page.url();
        expect(menJeansUrl).not.toBe(womenTopsUrl);
        console.log("Men Jeans URL:", menJeansUrl);

        await expect(this.productNames.first()).toBeVisible();
        const menProductNames = await this.productNames.allTextContents();
        expect(menProductNames.length).toBeGreaterThan(0);
        console.log("Men Jeans products:", menProductNames);
    }

    async openAllProductsAndVerifyBrandLabels(): Promise<void> {
        await this.productsNavLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(automationExerciseBaseURL, URLConfig.UI.AutomationExercise.productURL));
        await expect(this.allProductsHeading).toBeVisible();
        await expect(this.brands).toBeVisible();
        await expect(this.poloLink).toBeVisible();
        await expect(this.hmLink).toBeVisible();

        const brandLabels = await this.brands.getByRole("link").allTextContents();
        console.log("Brand labels and counts:", brandLabels);
        // textContent reads the original label without CSS uppercase formatting.
        const poloLabel = ((await this.poloLink.textContent()) ?? "").replace(/\(\d+\)/, "").trim();
        const hmLabel = ((await this.hmLink.textContent()) ?? "").replace(/\(\d+\)/, "").trim();
        expect(poloLabel).toBe(TC_03_CategoryProducts.brandPolo);
        expect(hmLabel).toBe(TC_03_CategoryProducts.brandHM);
        console.log("Polo and H&M brands are verified.");
    }

    async selectPoloAndCaptureProducts(): Promise<string> {
        await this.poloLink.click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.AutomationExercise.brandProductsURL}/Polo$`));
        await expect(this.poloProductsHeading).toBeVisible();
        await expect(this.productNames.first()).toBeVisible();
        const poloProductNames = await this.productNames.allTextContents();
        expect(poloProductNames.length).toBeGreaterThan(0);
        const poloUrl = this.page.url();
        console.log("Polo products:", poloProductNames);
        return poloUrl;
    }

    async selectHmAndVerifyDifferentBrand(poloUrl: string): Promise<void> {
        await this.hmLink.click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.AutomationExercise.brandProductsURL}/H(%26|&)M$`));
        await expect(this.hmProductsHeading).toBeVisible();
        await expect(this.productNames.first()).toBeVisible();
        const hmProductNames = await this.productNames.allTextContents();
        expect(hmProductNames.length).toBeGreaterThan(0);
        expect(this.page.url()).not.toBe(poloUrl);
        console.log("H&M products:", hmProductNames);
        console.log("Brand URL changed from", poloUrl, "to", this.page.url());
    }

    async restoreAllProductsAndVerifySidebarsUsable(): Promise<void> {
        await this.productsNavLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(automationExerciseBaseURL, URLConfig.UI.AutomationExercise.productURL));
        await expect(this.allProductsHeading).toBeVisible();
        await expect(this.categories).toBeVisible();
        await expect(this.brands).toBeVisible();
        await this.womenCategoryLink.click();
        await expect(this.womenTopsLink).toBeVisible();
        await expect(this.poloLink).toBeVisible();
        await expect(this.poloLink).toBeEnabled();
        await expect(this.hmLink).toBeVisible();
        await expect(this.hmLink).toBeEnabled();
        console.log("All Products is restored; category and brand controls are usable.");
    }
}
