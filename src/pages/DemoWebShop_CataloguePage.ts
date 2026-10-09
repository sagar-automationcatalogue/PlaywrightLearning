import { Page, Locator } from "@playwright/test";

export class DemoWebShop_CataloguePage {
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
        this.computersLnk = page.locator('.top-menu').getByRole('link', { name: 'Computers', exact: true });
        this.NotebookLnk = page.locator('.sub-category-grid').getByRole('link', { name: 'Notebooks', exact: true });
        this.NotebookHdr = page.getByRole('heading', { name: 'Notebooks', exact: true });
        this.productNameTxt = page.locator('.product-item').filter({ has: page.getByRole('link', { name: this.notebookName, exact: true })});
        this.productNameLnk = this.productNameTxt.getByRole('link', { name: this.notebookName, exact: true });
        this.productNameHdr = page.getByRole('heading', { name: this.notebookName, exact: true });
        this.addToCartBtn = page.getByRole('heading', { name: this.notebookName, exact: true });
        this.barNotificationTxt = page.locator('.bar-notification');
    }
}