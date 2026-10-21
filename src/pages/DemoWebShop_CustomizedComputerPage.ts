import { expect, Locator, Page } from "@playwright/test";
import { TC_04_BuildCustomizedComputer } from "../../test-data/demoWebShop";

export type CustomizedComputerCartState = {
    initialCartRows: string[];
    initialQuantities: string[];
    initialCartCountText: string;
    initialCartCount: number;
};

export class DemoWebShop_CustomizedComputerPage {
    private page: Page;
    private cartLink: Locator;
    private shoppingCartHeading: Locator;
    private cartRows: Locator;
    private headerCartQuantity: Locator;
    private computersLink: Locator;
    private computersHeading: Locator;
    private subcategories: Locator;
    private desktopsLink: Locator;
    private notebooksLink: Locator;
    private accessoriesLink: Locator;
    private desktopsHeading: Locator;
    private desktopProducts: Locator;
    private catalogProduct: Locator;
    private catalogProductLink: Locator;
    private productEssential: Locator;
    private productAttributes: Locator;
    private productHeading: Locator;
    private stockStatus: Locator;
    private addToCartButton: Locator;
    private processorOption: Locator;
    private ramOption: Locator;
    private hddOption: Locator;
    private imageViewerOption: Locator;
    private officeSuiteOption: Locator;
    private otherOfficeSuiteOption: Locator;
    private selectedSoftwareOptions: Locator;
    private selectedOptionLabels: Locator[];
    private productQuantity: Locator;
    private addToCartNotification: Locator;
    private configuredComputerRow: Locator;
    private updateShoppingCartButton: Locator;
    private emptyCartMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator("#topcartlink").getByRole("link");
        this.shoppingCartHeading = page.getByRole("heading", {
            name: TC_04_BuildCustomizedComputer.shoppingCartHeading,
            exact: true
        });
        this.cartRows = page.locator(".cart-item-row");
        this.headerCartQuantity = page.locator("#topcartlink .cart-qty");
        this.computersLink = page.locator(".top-menu").getByRole("link", { name: "Computers", exact: true });
        this.computersHeading = page.getByRole("heading", { name: "Computers", exact: true });
        this.subcategories = page.locator(".sub-category-grid");
        this.desktopsLink = this.subcategories.getByRole("link", { name: "Desktops", exact: true });
        this.notebooksLink = this.subcategories.getByRole("link", { name: "Notebooks", exact: true });
        this.accessoriesLink = this.subcategories.getByRole("link", { name: "Accessories", exact: true });
        this.desktopsHeading = page.getByRole("heading", { name: "Desktops", exact: true });
        this.desktopProducts = page.locator(".product-grid .product-item");
        this.catalogProduct = this.desktopProducts.filter({
            has: page.locator(".product-title").getByRole("link", {
                name: TC_04_BuildCustomizedComputer.productName,
                exact: true
            })
        });
        this.catalogProductLink = this.catalogProduct.locator(".product-title").getByRole("link", {
            name: TC_04_BuildCustomizedComputer.productName,
            exact: true
        });
        this.productEssential = page.locator(".product-essential");
        this.productAttributes = page.locator(".attributes");
        this.productHeading = page.getByRole("heading", {
            name: TC_04_BuildCustomizedComputer.productName,
            exact: true
        });
        this.stockStatus = page.locator(".stock .value");
        this.addToCartButton = this.productEssential.getByRole("button", { name: "Add to cart", exact: true });
        this.processorOption = page.getByRole("radio", {
            name: new RegExp(`^${TC_04_BuildCustomizedComputer.processorOption}\\s`)
        });
        this.ramOption = page.getByRole("radio", {
            name: new RegExp(`^${TC_04_BuildCustomizedComputer.ramOption}\\s`)
        });
        this.hddOption = page.getByRole("radio", {
            name: new RegExp(`^${TC_04_BuildCustomizedComputer.hddOption}\\s`)
        });
        this.imageViewerOption = page.getByRole("checkbox", {
            name: new RegExp(`^${TC_04_BuildCustomizedComputer.imageViewer}\\s`)
        });
        this.officeSuiteOption = page.getByRole("checkbox", {
            name: new RegExp(`^${TC_04_BuildCustomizedComputer.officeSuite}\\s`)
        });
        this.otherOfficeSuiteOption = page.getByRole("checkbox", {
            name: new RegExp(`^${TC_04_BuildCustomizedComputer.otherOfficeSuite}\\s`)
        });
        this.selectedSoftwareOptions = this.productAttributes.locator('input[type="checkbox"]:checked');
        this.selectedOptionLabels = [
            TC_04_BuildCustomizedComputer.processorOption,
            TC_04_BuildCustomizedComputer.ramOption,
            TC_04_BuildCustomizedComputer.hddOption,
            TC_04_BuildCustomizedComputer.imageViewer,
            TC_04_BuildCustomizedComputer.officeSuite
        ].map(option => this.productAttributes.locator("label").filter({
            hasText: new RegExp(`^${option}\\s`)
        }));
        this.productQuantity = this.productEssential.getByLabel("Qty:", { exact: true });
        this.addToCartNotification = page.locator("#bar-notification");
        this.configuredComputerRow = this.cartRows.filter({
            has: page.getByRole("link", { name: TC_04_BuildCustomizedComputer.productName, exact: true })
        }).filter({ hasText: TC_04_BuildCustomizedComputer.processorCartText })
            .filter({ hasText: TC_04_BuildCustomizedComputer.ramCartText })
            .filter({ hasText: TC_04_BuildCustomizedComputer.hddCartText })
            .filter({ hasText: `Software: ${TC_04_BuildCustomizedComputer.imageViewer}` })
            .filter({ hasText: `Software: ${TC_04_BuildCustomizedComputer.officeSuite}` })
            .filter({ hasNotText: TC_04_BuildCustomizedComputer.otherOfficeSuite });
        this.updateShoppingCartButton = page.getByRole("button", { name: "Update shopping cart", exact: true });
        this.emptyCartMessage = page.getByText(TC_04_BuildCustomizedComputer.emptyCartMessage, { exact: true });
    }

    async captureInitialCartState(): Promise<CustomizedComputerCartState> {
        await this.cartLink.click();
        await expect(this.shoppingCartHeading).toBeVisible();
        const initialCartRows = await this.cartRows.allInnerTexts();
        const initialQuantities: string[] = [];
        for (const row of await this.cartRows.all()) {
            initialQuantities.push(await row.locator(".qty-input").inputValue());
        }
        const initialCartCountText = await this.headerCartQuantity.innerText();
        const initialCartCount = Number(initialCartCountText.replace(/[^0-9]/g, ""));
        expect(Number.isInteger(initialCartCount)).toBe(true);

        // Adding an identical existing configuration would merge quantities.
        // Stop before changing the cart if that configuration is already present.
        await expect(this.configuredComputerRow, "The test configuration must not already be in the cart").toHaveCount(0);
        console.log("Initial cart quantity:", initialCartCount);

        return { initialCartRows, initialQuantities, initialCartCountText, initialCartCount };
    }

    async openComputersAndVerifyCategories(): Promise<void> {
        await this.computersLink.click();
        await expect(this.page).toHaveURL(/\/computers$/);
        await expect(this.computersHeading).toBeVisible();

        await expect(this.desktopsLink).toBeVisible();
        await expect(this.notebooksLink).toBeVisible();
        await expect(this.accessoriesLink).toBeVisible();
    }

    async openDesktopsAndVerifyProducts(): Promise<void> {
        await this.desktopsLink.click();
        await expect(this.page).toHaveURL(/\/desktops$/);
        await expect(this.desktopsHeading).toBeVisible();
        await expect(this.desktopProducts.first()).toBeVisible();
        expect(await this.desktopProducts.count()).toBeGreaterThan(0);
        console.log("Steps 2-5: Computers subcategories verified and desktop products displayed.");
    }

    async openComputerAndVerifyBasePrice(): Promise<number> {
        await expect(this.catalogProduct).toHaveCount(1);
        await expect(this.catalogProduct).toBeVisible();

        const basePriceText = await this.catalogProduct.locator(".actual-price").innerText();
        const basePrice = Number(basePriceText.replace(/[^0-9.]/g, ""));
        expect(Number.isFinite(basePrice)).toBe(true);
        expect(basePrice).toBe(TC_04_BuildCustomizedComputer.basePrice);
        console.log("Steps 6-7: Target computer found. Catalog base price:", basePrice);

        await this.catalogProductLink.click();
        await expect(this.productEssential).toBeVisible();
        await expect(this.productAttributes).toBeVisible();
        await expect(this.productHeading).toBeVisible();
        await expect(this.stockStatus).toHaveText(TC_04_BuildCustomizedComputer.stockStatus);
        await expect(this.addToCartButton).toBeEnabled();
        console.log("Steps 8-10: Correct product details opened; computer is in stock.");
        return basePrice;
    }

    async configureComputerAndSetQuantity(basePrice: number): Promise<number> {
        await this.processorOption.check();
        await expect(this.processorOption).toBeChecked();

        await this.ramOption.check();
        await expect(this.ramOption).toBeChecked();

        await this.hddOption.check();
        await expect(this.hddOption).toBeChecked();

        await this.imageViewerOption.check();
        await expect(this.imageViewerOption).toBeChecked();

        await this.officeSuiteOption.check();
        await expect(this.officeSuiteOption).toBeChecked();

        await this.otherOfficeSuiteOption.uncheck();
        await expect(this.otherOfficeSuiteOption).not.toBeChecked();
        await expect(this.selectedSoftwareOptions).toHaveCount(TC_04_BuildCustomizedComputer.selectedSoftwareCount);
        console.log("Steps 11-16: Fast processor, 8GB RAM, 400GB HDD, Image Viewer and Office Suite selected.");

        // Example label: Fast [+100.00]. Only the value inside [+...] is the addition.
        const selectedOptionLabelTexts = await Promise.all(
            this.selectedOptionLabels.map(optionLabel => optionLabel.innerText())
        );
        let expectedUnitPrice = basePrice;
        for (const optionLabel of selectedOptionLabelTexts) {
            const additionMatch = optionLabel.match(/\[\+([\d,.]+)\]/);
            expect(additionMatch, "Selected option should show a price addition").not.toBeNull();
            const optionAddition = Number(additionMatch![1].replace(/,/g, ""));
            expect(Number.isFinite(optionAddition)).toBe(true);
            expectedUnitPrice += optionAddition;
        }
        expect(expectedUnitPrice).toBe(TC_04_BuildCustomizedComputer.expectedUnitPrice);
        console.log("Step 17: Base price plus selected additions:", expectedUnitPrice);

        await this.productQuantity.fill(String(TC_04_BuildCustomizedComputer.requestedQuantity));
        await expect(this.productQuantity).toHaveValue(String(TC_04_BuildCustomizedComputer.requestedQuantity));
        return expectedUnitPrice;
    }

    async addConfiguredComputerAndVerifyCart(
        initialCartCount: number,
        expectedUnitPrice: number
    ): Promise<void> {
        await this.addToCartButton.click();
        await expect(this.addToCartNotification).toBeVisible();
        await expect(this.addToCartNotification).toContainText(TC_04_BuildCustomizedComputer.addToCartConfirmation);
        console.log("Steps 18-20: Two configured computers successfully added to the cart.");

        await expect(this.headerCartQuantity).toHaveText(
            `(${initialCartCount + TC_04_BuildCustomizedComputer.requestedQuantity})`
        );

        await this.cartLink.click();
        await expect(this.page).toHaveURL(/\/cart$/);
        await expect(this.shoppingCartHeading).toBeVisible();

        await expect(this.configuredComputerRow).toHaveCount(1);
        await expect(this.configuredComputerRow).toBeVisible();

        const attributes = this.configuredComputerRow.locator(".attributes");
        await expect(attributes).toContainText(TC_04_BuildCustomizedComputer.processorCartText);
        await expect(attributes).toContainText(TC_04_BuildCustomizedComputer.ramCartText);
        await expect(attributes).toContainText(TC_04_BuildCustomizedComputer.hddCartText);
        await expect(attributes).toContainText(`Software: ${TC_04_BuildCustomizedComputer.imageViewer}`);
        await expect(attributes).toContainText(`Software: ${TC_04_BuildCustomizedComputer.officeSuite}`);
        await expect(attributes).not.toContainText(TC_04_BuildCustomizedComputer.otherOfficeSuite);
        console.log("Steps 21-24: Cart count and configured computer attributes verified.");

        const cartQuantity = this.configuredComputerRow.locator(".qty-input");
        await expect(cartQuantity).toHaveValue(String(TC_04_BuildCustomizedComputer.requestedQuantity));
        const quantity = Number(await cartQuantity.inputValue());

        const unitPriceText = await this.configuredComputerRow.locator(".product-unit-price").innerText();
        console.log("Step 26: Displayed unit price:", unitPriceText);

        const subtotalText = await this.configuredComputerRow.locator(".product-subtotal").innerText();
        console.log("Step 27: Displayed subtotal:", subtotalText);

        const unitPrice = Number(unitPriceText.replace(/[^0-9.]/g, ""));
        const subtotal = Number(subtotalText.replace(/[^0-9.]/g, ""));
        expect(Number.isFinite(unitPrice)).toBe(true);
        expect(Number.isFinite(subtotal)).toBe(true);
        expect(unitPrice).toBe(expectedUnitPrice);

        const expectedSubtotal = unitPrice * quantity;
        expect(expectedSubtotal).toBe(expectedUnitPrice * TC_04_BuildCustomizedComputer.requestedQuantity);
        console.log("Steps 28-29: Expected subtotal =", unitPrice, "x", quantity, "=", expectedSubtotal);

        expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
        console.log("Step 30: UI subtotal matches the calculation.");
    }

    async removeConfiguredComputerAndVerifyCart(state: CustomizedComputerCartState): Promise<void> {
        await this.page.goto("https://demowebshop.tricentis.com/cart");
        await expect(this.shoppingCartHeading).toBeVisible();
        if (await this.configuredComputerRow.count() === 1) {
            await this.configuredComputerRow.getByRole("checkbox").check();
            await this.updateShoppingCartButton.click();
        }
        await expect(this.configuredComputerRow).toHaveCount(0);
        console.log("Step 31: Configured computer removed.");

        await expect(this.headerCartQuantity).toHaveText(state.initialCartCountText);
        await expect(this.cartRows).toHaveCount(state.initialCartRows.length);
        expect(await this.cartRows.allInnerTexts()).toEqual(state.initialCartRows);
        const remainingQuantities: string[] = [];
        for (const row of await this.cartRows.all()) {
            remainingQuantities.push(await row.locator(".qty-input").inputValue());
        }
        expect(remainingQuantities).toEqual(state.initialQuantities);
        if (state.initialCartRows.length === 0) {
            await expect(this.emptyCartMessage).toBeVisible();
        }
        console.log("Step 32: Original cart state restored. Cleanup successful.");
    }
}
