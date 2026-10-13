import { Page, Locator,expect } from "@playwright/test";

export class DemoWebShop_CataloguePage {
    private page: Page
    private computersLnk: Locator;
    private NotebookLnk: Locator;
    private NotebookHdr: Locator;
    private productNameTxt: Locator;
    private productNameLnk: Locator
    private productNameHdr: Locator;
    private addToCartBtn:Locator;
    private barNotificationTxt: Locator;
    private notebookName:string = '14.1-inch Laptop';

    constructor(page: Page){
        this.page = page;
        this.computersLnk = page.locator('.top-menu').getByRole('link', { name: 'Computers', exact: true });
        this.NotebookLnk = page.locator('.sub-category-grid').getByRole('link', { name: 'Notebooks', exact: true });
        this.NotebookHdr = page.getByRole('heading', { name: 'Notebooks', exact: true });
        this.productNameTxt = page.locator('.product-item').filter({ has: page.getByRole('link', { name: this.notebookName, exact: true })});
        this.productNameLnk = this.productNameTxt.getByRole('link', { name: this.notebookName, exact: true });
        this.productNameHdr = page.getByRole('heading', { name: this.notebookName, exact: true });
        this.addToCartBtn = page.locator('.product-essential').getByRole('button', { name: 'Add to cart', exact: true });
        this.barNotificationTxt = page.locator('.bar-notification');
    }

    async openProductCategory(): Promise<void>{
        console.log('Opening the Computers > Notebooks category');
        await this.computersLnk.click();
        await expect(this.page).toHaveURL(/\/computers$/);
        await this.NotebookLnk.click();
        await expect(this.page).toHaveURL(/\/notebooks$/);
        await expect(this.NotebookHdr).toBeVisible();
    }

    async addToCart_Product(): Promise<void>{          
        await expect(this.productNameTxt).toHaveCount(1);
        await this.productNameLnk.click();
        await expect(this.productNameHdr).toBeVisible();

        console.log(`Adding ${this.notebookName} to the shopping cart`);
        await this.addToCartBtn.click();
        await expect(this.barNotificationTxt).toContainText('The product has been added to your shopping cart');
    }
}