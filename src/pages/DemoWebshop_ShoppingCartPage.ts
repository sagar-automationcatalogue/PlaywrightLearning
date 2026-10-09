import { Page, Locator } from "@playwright/test";

export class DemoWebShop_ShoppingCartPage{
    private topCartLnk:Locator;
    private shoppingCartHdr:Locator;
    private cartItemRow:Locator;
    private qtyInput:Locator;
    private updateShoppingCartBtn:Locator;
    private termsOfServiceChkbx:Locator;
    private checkoutBtn:Locator;
    private notebookName:string = '14.1-inch Laptop';
    
    constructor(page: Page){
        this.topCartLnk = page.locator('#topcartlink').getByRole('link');
        this.shoppingCartHdr = page.getByRole('heading', { name: 'Shopping cart', exact: true });
        this.cartItemRow = page.locator('.cart-item-row').filter({ has: page.getByRole('link', { name: this.notebookName, exact: true })});
        this.qtyInput = this.cartItemRow.locator('.qty-input');
        this.updateShoppingCartBtn = page.getByRole('button', { name: 'Update shopping cart', exact: true });
        this.termsOfServiceChkbx = page.locator('#termsofservice');
        this.checkoutBtn = page.getByRole('button', { name: 'Checkout', exact: true });    
    }
}