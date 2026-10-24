import { expect, Locator, Page } from "@playwright/test";
import { TC_05_ConfigureApparelProduct } from "../../test-data/demoWebShop";
import { demoWebShopBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";

export type ApparelProductStartingCounts = {
    wishlist: number;
    cart: number;
};

export class DemoWebShop_ApparelProductPage {
    private page: Page;
    private wishlistRows: Locator;
    private oldWishlistSneakerRows: Locator;
    private updateWishlistButton: Locator;
    private cartRows: Locator;
    private oldCartSneakerRows: Locator;
    private updateShoppingCartButton: Locator;
    private wishlistCount: Locator;
    private cartCount: Locator;
    private apparelShoesLink: Locator;
    private apparelShoesHeading: Locator;
    private sneakerProduct: Locator;
    private sneakerProductLink: Locator;
    private catalogPrice: Locator;
    private productHeading: Locator;
    private productAvailability: Locator;
    private sizeDropdown: Locator;
    private colorOptions: Locator;
    private secondColorOption: Locator;
    private productQuantity: Locator;
    private addToWishlistButton: Locator;
    private wishlistConfirmation: Locator;
    private wishlistLink: Locator;
    private wishlistSneakerRow: Locator;
    private wishlistSneakerQuantity: Locator;
    private addToCartCheckbox: Locator;
    private addToCartButton: Locator;
    private shoppingCartHeading: Locator;
    private cartSneakerRow: Locator;
    private cartQuantityField: Locator;
    private cartUnitPrice: Locator;
    private cartSubtotal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.wishlistRows = page.locator(".cart-item-row");
        this.oldWishlistSneakerRows = this.wishlistRows.filter({
            hasText: TC_05_ConfigureApparelProduct.productName
        });
        this.updateWishlistButton = page.getByRole("button", { name: "Update wishlist", exact: true });
        this.cartRows = page.locator(".cart-item-row");
        this.oldCartSneakerRows = this.cartRows.filter({
            hasText: TC_05_ConfigureApparelProduct.productName
        });
        this.updateShoppingCartButton = page.getByRole("button", { name: "Update shopping cart", exact: true });
        this.wishlistCount = page.locator(".wishlist-qty");
        this.cartCount = page.locator(".cart-qty");
        this.apparelShoesLink = page.getByRole("link", { name: "Apparel & Shoes", exact: true }).first();
        this.apparelShoesHeading = page.getByRole("heading", { name: "Apparel & Shoes", exact: true });
        this.sneakerProduct = page.locator(".product-item").filter({
            has: page.getByRole("link", { name: TC_05_ConfigureApparelProduct.productName, exact: true })
        });
        this.sneakerProductLink = this.sneakerProduct.getByRole("link", {
            name: TC_05_ConfigureApparelProduct.productName,
            exact: true
        });
        this.catalogPrice = this.sneakerProduct.locator(".price.actual-price");
        this.productHeading = page.getByRole("heading", {
            name: TC_05_ConfigureApparelProduct.productName,
            exact: true
        });
        this.productAvailability = page.locator(".stock .value");
        this.sizeDropdown = page.locator('select[id^="product_attribute_"]');
        this.colorOptions = page.locator('.color-squares input[type="radio"]');
        this.secondColorOption = page.locator(".color-squares label").nth(1);
        this.productQuantity = page.getByRole("textbox", { name: "Qty:" });
        this.addToWishlistButton = page.getByRole("button", { name: "Add to wishlist", exact: true });
        this.wishlistConfirmation = page.getByText(Constants.DemoWebShop.wishlistConfirmation, {
            exact: false
        });
        this.wishlistLink = page.getByRole("link", { name: /Wishlist \(\d+\)/ });
        this.wishlistSneakerRow = this.wishlistRows.filter({
            has: page.getByRole("link", { name: TC_05_ConfigureApparelProduct.productName, exact: true })
        });
        this.wishlistSneakerQuantity = this.wishlistSneakerRow.locator('input[name^="itemquantity"]');
        this.addToCartCheckbox = this.wishlistSneakerRow.locator('input[name="addtocart"]');
        this.addToCartButton = page.getByRole("button", { name: "Add to cart", exact: true });
        this.shoppingCartHeading = page.getByRole("heading", { name: "Shopping cart", exact: true });
        this.cartSneakerRow = this.cartRows
            .filter({ hasText: TC_05_ConfigureApparelProduct.productName })
            .filter({ hasText: `Size: ${TC_05_ConfigureApparelProduct.size}` })
            .filter({ hasText: `Color: ${TC_05_ConfigureApparelProduct.color}` });
        this.cartQuantityField = this.cartSneakerRow.locator('input[name^="itemquantity"]');
        this.cartUnitPrice = this.cartSneakerRow.locator(".product-unit-price");
        this.cartSubtotal = this.cartSneakerRow.locator(".product-subtotal");
    }

    async removePreviousSneakerEntriesAndCaptureCounts(): Promise<ApparelProductStartingCounts> {
        console.log("Removing any previous Blue and green Sneaker entries");
        await this.page.goto(joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.wishList));
        const oldWishlistSneakerCount = await this.oldWishlistSneakerRows.count();

        for (let index = 0; index < oldWishlistSneakerCount; index++) {
            await this.oldWishlistSneakerRows.nth(index).locator('input[name="removefromcart"]').check();
        }

        if (oldWishlistSneakerCount > 0) {
            await this.updateWishlistButton.click();
            await expect(this.oldWishlistSneakerRows).toHaveCount(0);
        }

        await this.page.goto(joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.cart));
        const oldCartSneakerCount = await this.oldCartSneakerRows.count();

        for (let index = 0; index < oldCartSneakerCount; index++) {
            await this.oldCartSneakerRows.nth(index).locator('input[name="removefromcart"]').check();
        }

        if (oldCartSneakerCount > 0) {
            await this.updateShoppingCartButton.click();
            await expect(this.oldCartSneakerRows).toHaveCount(0);
        }

        const startingWishlistCount = Number.parseInt((await this.wishlistCount.innerText()).replace(/[^\d]/g, ""), 10);
        const startingCartCount = Number.parseInt((await this.cartCount.innerText()).replace(/[^\d]/g, ""), 10);
        expect(Number.isFinite(startingWishlistCount)).toBeTruthy();
        expect(Number.isFinite(startingCartCount)).toBeTruthy();

        return { wishlist: startingWishlistCount, cart: startingCartCount };
    }

    async openApparelCategoryAndCapturePrice(): Promise<number> {
        await this.apparelShoesLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.apparelShoes));
        await expect(this.apparelShoesHeading).toBeVisible();
        console.log("Apparel & Shoes category page is displayed");

        await expect(this.sneakerProduct).toBeVisible();
        const catalogPriceText = await this.catalogPrice.innerText();
        const catalogPrice = Number.parseFloat(catalogPriceText.replace(/[^0-9.]/g, ""));
        expect(Number.isFinite(catalogPrice)).toBeTruthy();
        console.log(`${TC_05_ConfigureApparelProduct.productName} catalog price: ${catalogPriceText}`);

        await this.sneakerProductLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.blueGreenSneaker));
        await expect(this.productHeading).toBeVisible();
        await expect(this.productAvailability).toBeVisible();
        await expect(this.productAvailability).toContainText(TC_05_ConfigureApparelProduct.availability);
        console.log(`Product availability: ${await this.productAvailability.innerText()}`);

        return catalogPrice;
    }

    async configureSneakerAndAddToWishlist(startingWishlistCount: number): Promise<void> {
        await this.sizeDropdown.selectOption({ label: TC_05_ConfigureApparelProduct.size });
        await expect(this.sizeDropdown.locator("option:checked")).toHaveText(TC_05_ConfigureApparelProduct.size);

        await this.secondColorOption.click();
        await expect(this.colorOptions.nth(1)).toBeChecked();
        await expect(this.secondColorOption.locator("[title]")).toHaveAttribute(
            "title",
            TC_05_ConfigureApparelProduct.color
        );

        await this.productQuantity.fill(TC_05_ConfigureApparelProduct.quantity);
        await expect(this.productQuantity).toHaveValue(TC_05_ConfigureApparelProduct.quantity);
        console.log(
            `Selected size ${TC_05_ConfigureApparelProduct.size}, the second color (${TC_05_ConfigureApparelProduct.color}), and quantity ${TC_05_ConfigureApparelProduct.quantity}`
        );

        await this.addToWishlistButton.click();
        await expect(this.wishlistConfirmation).toBeVisible();

        const wishlistCountAfterAdding = Number.parseInt(
            (await this.wishlistCount.innerText()).replace(/[^\d]/g, ""),
            10
        );
        expect(wishlistCountAfterAdding).toBeGreaterThan(startingWishlistCount);
        console.log(`Wishlist count increased from ${startingWishlistCount} to ${wishlistCountAfterAdding}`);
    }

    async addWishlistSneakerToCartAndVerify(startingCartCount: number, catalogPrice: number): Promise<void> {
        await this.wishlistLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.wishList));

        await expect(this.wishlistSneakerRow).toBeVisible();
        await expect(this.wishlistSneakerRow).toContainText(`Size: ${TC_05_ConfigureApparelProduct.size}`);
        await expect(this.wishlistSneakerRow).toContainText(`Color: ${TC_05_ConfigureApparelProduct.color}`);
        await expect(this.wishlistSneakerQuantity).toHaveValue(TC_05_ConfigureApparelProduct.quantity);
        console.log(
            `Wishlist contains the sneaker with size ${TC_05_ConfigureApparelProduct.size}, ${TC_05_ConfigureApparelProduct.color} color, and quantity ${TC_05_ConfigureApparelProduct.quantity}`
        );

        await this.addToCartCheckbox.check();
        await expect(this.addToCartCheckbox).toBeChecked();
        await this.addToCartButton.click();
        await expect(this.page).toHaveURL(joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.cart));

        const cartCountAfterAdding = Number.parseInt(
            (await this.cartCount.innerText()).replace(/[^\d]/g, ""),
            10
        );
        expect(cartCountAfterAdding).toBeGreaterThan(startingCartCount);
        console.log(`Shopping Cart count increased from ${startingCartCount} to ${cartCountAfterAdding}`);

        await expect(this.shoppingCartHeading).toBeVisible();
        await expect(this.cartSneakerRow).toBeVisible();
        await expect(this.cartSneakerRow).toContainText(TC_05_ConfigureApparelProduct.productName);
        await expect(this.cartSneakerRow).toContainText(`Size: ${TC_05_ConfigureApparelProduct.size}`);
        await expect(this.cartSneakerRow).toContainText(`Color: ${TC_05_ConfigureApparelProduct.color}`);
        await expect(this.cartQuantityField).toHaveValue(TC_05_ConfigureApparelProduct.quantity);

        const cartUnitPriceText = await this.cartUnitPrice.innerText();
        const cartUnitPrice = Number.parseFloat(cartUnitPriceText.replace(/[^0-9.]/g, ""));
        const cartQuantity = Number.parseInt(await this.cartQuantityField.inputValue(), 10);
        const expectedSubtotal = cartUnitPrice * cartQuantity;
        console.log(`Expected line subtotal: ${cartUnitPrice} x ${cartQuantity} = ${expectedSubtotal}`);

        const cartSubtotalText = await this.cartSubtotal.innerText();
        const displayedSubtotal = Number.parseFloat(cartSubtotalText.replace(/[^0-9.]/g, ""));
        expect(cartUnitPrice).toBe(catalogPrice);
        expect(cartQuantity).toBe(Number(TC_05_ConfigureApparelProduct.quantity));
        expect(displayedSubtotal).toBe(expectedSubtotal);
        console.log(`Cart unit price: ${cartUnitPriceText}; expected and displayed subtotal: ${cartSubtotalText}`);
    }

    async removeSneakerFromCart(): Promise<void> {
        await this.cartSneakerRow.locator('input[name="removefromcart"]').check();
        await this.updateShoppingCartButton.click();
        await expect(this.cartRows.filter({ hasText: TC_05_ConfigureApparelProduct.productName })).toHaveCount(0);
        console.log(`${TC_05_ConfigureApparelProduct.productName} was removed from the cart`);
    }
}
