import { expect, Locator, Page } from "@playwright/test";
import { TC_05_ProductReview } from "../../test-data/automationExercise";
import { automationExerciseBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";

export class AutomationExercise_ProductReviewPage {
    private page: Page;
    private productsLink: Locator;
    private blueTopCard: Locator;
    private productInformation: Locator;
    private quantityInput: Locator;
    private addToCartButton: Locator;
    private cartModal: Locator;
    private blueTopCartRow: Locator;
    private reviewHeading: Locator;
    private reviewName: Locator;
    private reviewEmail: Locator;
    private reviewText: Locator;
    private submitReviewButton: Locator;
    private reviewSuccessMessage: Locator;
    private cartLink: Locator;
    private emptyCartMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsLink = page.getByRole("link", { name: "Products" });
        this.blueTopCard = page.locator(".product-image-wrapper")
            .filter({ hasText: TC_05_ProductReview.productName })
            .first();
        this.productInformation = page.locator(".product-information");
        this.quantityInput = page.locator("#quantity");
        this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
        this.cartModal = page.locator("#cartModal");
        this.blueTopCartRow = page.locator("#cart_info_table tbody tr")
            .filter({ hasText: TC_05_ProductReview.productName });
        this.reviewHeading = page.getByText("Write Your Review", { exact: false });
        this.reviewName = page.locator("#name");
        this.reviewEmail = page.locator("#email");
        this.reviewText = page.locator("#review");
        this.submitReviewButton = page.getByRole("button", { name: "Submit" });
        this.reviewSuccessMessage = page.getByText(Constants.AutomationExercise.reviewSuccess, { exact: true });
        this.cartLink = page.getByRole("link", { name: "Cart" });
        this.emptyCartMessage = page.getByText(Constants.AutomationExercise.emptyCartMessage, { exact: false });
    }

    async openProductsAndBlueTopDetails(): Promise<number> {
        await this.productsLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(automationExerciseBaseURL, URLConfig.UI.AutomationExercise.productURL));
        console.log("All Products page is open");

        await expect(this.blueTopCard).toBeVisible();
        console.log("Blue Top is visible in the product list");

        await this.blueTopCard.getByRole("link", { name: "View Product" }).click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.AutomationExercise.productDetailsURL}/1`));
        console.log("Blue Top detail page is open");

        await expect(this.productInformation.locator("h2")).toHaveText(TC_05_ProductReview.productName);
        await expect(this.productInformation.getByText(TC_05_ProductReview.productCategory, { exact: true })).toBeVisible();
        console.log("Product name and category are correct");

        const unitPriceText = await this.productInformation.locator("span span").innerText();
        const unitPrice = Number(unitPriceText.replace(TC_05_ProductReview.currencyPrefix, "").trim());
        expect(unitPrice).toBeGreaterThan(0);
        console.log(`Captured Blue Top unit price: ${unitPriceText}`);

        await expect(this.productInformation.getByText(TC_05_ProductReview.availability, { exact: true })).toBeVisible();
        await expect(this.productInformation.getByText(TC_05_ProductReview.condition, { exact: true })).toBeVisible();
        await expect(this.productInformation.getByText(TC_05_ProductReview.brand, { exact: true })).toBeVisible();
        console.log("Availability, condition, and brand are correct");
        return unitPrice;
    }

    async setQuantityAddToCartAndVerify(unitPrice: number): Promise<void> {
        await expect(this.quantityInput).toBeVisible();
        const defaultQuantity = await this.quantityInput.inputValue();
        expect(defaultQuantity).toBe(TC_05_ProductReview.defaultQuantity);
        console.log(`Captured default quantity: ${defaultQuantity}`);

        await this.quantityInput.fill(TC_05_ProductReview.selectedQuantity);
        await expect(this.quantityInput).toHaveValue(TC_05_ProductReview.selectedQuantity);
        console.log(`Quantity is set to ${TC_05_ProductReview.selectedQuantity}`);

        await this.addToCartButton.click();
        await expect(this.cartModal).toBeVisible();
        await expect(this.cartModal).toContainText(Constants.AutomationExercise.cartConfirmation);
        console.log("Add-to-cart confirmation is displayed");

        await this.cartModal.getByRole("link", { name: "View Cart" }).click();
        await expect(this.page).toHaveURL(joinBaseURL(automationExerciseBaseURL, URLConfig.UI.AutomationExercise.cartURL));
        console.log("Cart page is open");

        await expect(this.blueTopCartRow).toBeVisible();
        await expect(this.blueTopCartRow.locator(".cart_quantity button")).toHaveText(TC_05_ProductReview.selectedQuantity);

        const cartUnitPriceText = await this.blueTopCartRow.locator(".cart_price").innerText();
        const cartLineTotalText = await this.blueTopCartRow.locator(".cart_total").innerText();
        const cartUnitPrice = Number(cartUnitPriceText.replace(TC_05_ProductReview.currencyPrefix, "").trim());
        const cartLineTotal = Number(cartLineTotalText.replace(TC_05_ProductReview.currencyPrefix, "").trim());
        const expectedLineTotal = cartUnitPrice * Number(TC_05_ProductReview.selectedQuantity);

        expect(cartUnitPrice).toBe(unitPrice);
        expect(cartLineTotal).toBe(expectedLineTotal);
        console.log(`Cart unit price: ${cartUnitPriceText}; line total: ${cartLineTotalText}`);
        console.log(`Verified line total: ${cartUnitPrice} × ${TC_05_ProductReview.selectedQuantity} = ${expectedLineTotal}`);
    }

    async submitProductReview(): Promise<void> {
        await this.page.goBack();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.AutomationExercise.productDetailsURL}/1`));
        console.log("Returned to Blue Top detail page");

        await this.reviewHeading.scrollIntoViewIfNeeded();
        await expect(this.reviewHeading).toBeVisible();

        await expect(this.reviewName).toBeVisible();
        await expect(this.reviewEmail).toBeVisible();
        await expect(this.reviewText).toBeVisible();
        console.log("Review form fields are visible");

        await this.reviewName.fill(TC_05_ProductReview.reviewName);
        await this.reviewEmail.fill(TC_05_ProductReview.reviewEmail);
        await this.reviewText.fill(TC_05_ProductReview.reviewText);
        await expect(this.reviewName).toHaveValue(TC_05_ProductReview.reviewName);
        await expect(this.reviewEmail).toHaveValue(TC_05_ProductReview.reviewEmail);
        await expect(this.reviewText).toHaveValue(TC_05_ProductReview.reviewText);

        await this.submitReviewButton.click();
        await expect(this.reviewSuccessMessage).toBeVisible();
        console.log("Review submission is confirmed");
    }

    async removeBlueTopFromCart(): Promise<void> {
        await this.cartLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(automationExerciseBaseURL, URLConfig.UI.AutomationExercise.cartURL));
        await expect(this.blueTopCartRow).toBeVisible();

        await this.blueTopCartRow.locator(".cart_quantity_delete").click();
        await expect(this.blueTopCartRow).toHaveCount(0);
        await expect(this.emptyCartMessage).toBeVisible();
        console.log("Blue Top was removed from the cart");
    }
}
