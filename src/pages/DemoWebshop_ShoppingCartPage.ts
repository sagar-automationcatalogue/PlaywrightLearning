import { Page, Locator,expect } from "@playwright/test";
import { HeaderComponents } from "../components/HeaderComponents";

export class DemoWebShop_ShoppingCartPage{
    private shoppingCartHdr:Locator;
    private cartItemRow:Locator;
    private qtyInput:Locator;
    private updateShoppingCartBtn:Locator;
    private termsOfServiceChkbx:Locator;
    private checkoutBtn:Locator;
    private notebookName:string = '14.1-inch Laptop';
    private header: HeaderComponents;
    
    constructor(page: Page){
        this.header = new HeaderComponents(page);
        this.shoppingCartHdr = page.getByRole('heading', { name: 'Shopping cart', exact: true });
        this.cartItemRow = page.locator('.cart-item-row').filter({ has: page.getByRole('link', { name: this.notebookName, exact: true })});
        this.qtyInput = this.cartItemRow.locator('.qty-input');
        this.updateShoppingCartBtn = page.getByRole('button', { name: 'Update shopping cart', exact: true });
        this.termsOfServiceChkbx = page.locator('#termsofservice');
        this.checkoutBtn = page.getByRole('button', { name: 'Checkout', exact: true });    
    }

    async clickShoppingCart(): Promise<void>{
        console.log('Opening the shopping cart and setting the quantity to 2');
        await this.header.openCart();
    }

    async updateShoppingCart(): Promise<void>{        
        await expect(this.cartItemRow).toBeVisible();
        await this.qtyInput.fill('2');
        await this.updateShoppingCartBtn.click();
        await expect(this.qtyInput).toHaveValue('2');
    }

    async acceptTermsService(): Promise<void>{
        console.log('Accepting the terms of service and starting checkout');
        await this.termsOfServiceChkbx.check();
        await expect(this.termsOfServiceChkbx).toBeChecked();
    }

    async clickCheckoutBtn(): Promise<void>{
        await this.checkoutBtn.click();
    }
}