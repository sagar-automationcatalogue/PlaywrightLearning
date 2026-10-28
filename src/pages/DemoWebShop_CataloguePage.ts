import { Page, Locator,expect } from "@playwright/test";
import { TC_02_BooksCategory } from "../../test-data/demoWebShop";
import { demoWebShopBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";
import { HeaderComponents } from "../components/HeaderComponents";

export class DemoWebShop_CataloguePage {
    private page: Page
    private NotebookLnk: Locator;
    private NotebookHdr: Locator;
    private productNameTxt: Locator;
    private productNameLnk: Locator
    private productNameHdr: Locator;
    private addToCartBtn:Locator;
    private barNotificationTxt: Locator;
    private notebookName:string = '14.1-inch Laptop';
    private booksHdr: Locator;
    private productTitles: Locator;
    private productPrices: Locator;
    private sortDropdown: Locator;
    private pageSizeDropdown: Locator;
    private viewDropdown: Locator;
    private productItems: Locator;
    private priceFilterLnk: Locator;
    private removeFilterLnk: Locator;
    private productGrid: Locator;
    private productList: Locator;
    private viewLayOut: Locator;
    private header: HeaderComponents;

    constructor(page: Page){
        this.page = page;
        this.header = new HeaderComponents(page);
        this.NotebookLnk = page.locator('.sub-category-grid').getByRole('link', { name: 'Notebooks', exact: true });
        this.NotebookHdr = page.getByRole('heading', { name: 'Notebooks', exact: true });
        this.productNameTxt = page.locator('.product-item').filter({ has: page.getByRole('link', { name: this.notebookName, exact: true })});
        this.productNameLnk = this.productNameTxt.getByRole('link', { name: this.notebookName, exact: true });
        this.productNameHdr = page.getByRole('heading', { name: this.notebookName, exact: true });
        this.addToCartBtn = page.locator('.product-essential').getByRole('button', { name: 'Add to cart', exact: true });
        this.barNotificationTxt = page.locator('.bar-notification');
        this.booksHdr = page.getByRole('heading', { name: TC_02_BooksCategory.booksHeading });
        this.productTitles = page.locator('.product-title');
        this.productPrices = page.locator('.actual-price');
        this.sortDropdown = page.locator('#products-orderby');
        this.pageSizeDropdown = page.locator('#products-pagesize');
        this.viewDropdown = page.locator('#products-viewmode');
        this.productItems = page.locator('.product-item');
        this.priceFilterLnk = page.getByRole('link', { name: TC_02_BooksCategory.priceFilterLabel, exact: true });
        this.removeFilterLnk = page.getByRole('link', { name: Constants.DemoWebShop.removeFilterLabel, exact: true });
        this.productGrid = page.locator('.product-grid');
        this.productList = page.locator('.product-list');
        this.viewLayOut = page.locator(`#products-viewmode`)
    }

    async openBooksCategory(): Promise<void>{
        await this.header.openBooks();
        await expect(this.booksHdr).toBeVisible();
        console.log('Books category page is displayed');
    }

    async captureInitialProductNames(): Promise<string[]>{
        const initialProductNames = await this.productTitles.allInnerTexts();
        expect(initialProductNames.length).toBeGreaterThan(0);
        console.log('Products currently displayed:', initialProductNames);
        return initialProductNames;
    }

    async sortProductsByNameAndVerify(): Promise<void>{
        await this.sortDropdown.selectOption({ label: Constants.DemoWebShop.sortByName });
        await expect(this.page).toHaveURL(/orderby=5/);

        const sortedProductNames = await this.productTitles.allInnerTexts();
        expect(sortedProductNames.length).toBeGreaterThan(0);
        console.log('Product names after sorting A to Z:', sortedProductNames);

        const expectedAlphabeticalNames = [...sortedProductNames].sort((firstName, secondName) =>
            firstName.localeCompare(secondName)
        );
        expect(sortedProductNames).toEqual(expectedAlphabeticalNames);
        console.log('Product names are in alphabetical order');
    }

    async sortProductsByPriceAndVerify(): Promise<void>{
        await this.sortDropdown.selectOption({ label: Constants.DemoWebShop.sortByPrice });
        await expect(this.page).toHaveURL(/orderby=10/);

        const priceTexts = await this.productPrices.allInnerTexts();
        expect(priceTexts.length).toBeGreaterThan(0);
        console.log('Product prices after sorting low to high:', priceTexts);

        const prices = priceTexts.map((priceText) =>
            Number.parseFloat(priceText.replace(/[^0-9.]/g, ''))
        );
        expect(prices.every((price) => Number.isFinite(price))).toBeTruthy();

        for (let index = 1; index < prices.length; index++) {
            expect(prices[index]).toBeGreaterThanOrEqual(prices[index - 1]);
        }
        console.log('Product prices are in ascending order');
    }

    async changePageSizeAndView(): Promise<{ selectedPageSize: number; selectedViewLayout: string }>{
        const currentPageSize = (await this.pageSizeDropdown.locator('option:checked').textContent())?.trim();
        const availablePageSizes = await this.pageSizeDropdown.locator('option').allTextContents();
        const pageSizeToSelect = availablePageSizes.find(
            (pageSize) => pageSize.trim() !== currentPageSize
        )?.trim();

        if (!pageSizeToSelect) {
            throw new Error('No alternative page size is available to select.');
        }

        await this.pageSizeDropdown.selectOption({ label: pageSizeToSelect });
        await expect(this.page).toHaveURL(new RegExp(`pagesize=${pageSizeToSelect}`));
        await expect(this.pageSizeDropdown.locator('option:checked')).toHaveText(pageSizeToSelect);

        const selectedPageSize = Number(pageSizeToSelect);
        expect(Number.isFinite(selectedPageSize)).toBeTruthy();

        const productCountAfterPageSizeChange = await this.productItems.count();
        expect(productCountAfterPageSizeChange).toBeLessThanOrEqual(selectedPageSize);
        console.log(`Page size changed to ${selectedPageSize}; displayed products: ${productCountAfterPageSizeChange}`);

        const currentView = (await this.viewDropdown.locator('option:checked').textContent())?.trim();
        const availableViews = await this.viewDropdown.locator('option').allTextContents();
        const viewToSelect = availableViews.find((view) => view.trim() !== currentView)?.trim();

        if (!viewToSelect) {
            throw new Error('No alternative product view is available to select.');
        }

        await this.viewDropdown.selectOption({ label: viewToSelect });
        await expect(this.page).toHaveURL(new RegExp(`viewmode=${viewToSelect.toLowerCase()}`));
        await expect(this.viewDropdown.locator('option:checked')).toHaveText(viewToSelect);

        const selectedViewLayout = viewToSelect.toLowerCase() === 'list' ? '.product-list' : '.product-grid';
        const selectedViewLocator = viewToSelect.toLowerCase() === 'list' ? this.productList : this.productGrid;
        await expect(selectedViewLocator).toBeVisible();
        console.log(`Product view changed to ${viewToSelect}`);
        return { selectedPageSize, selectedViewLayout };
    }

    async applyPriceFilterAndVerify(): Promise<number>{
        await this.priceFilterLnk.click();
        await expect(this.page).toHaveURL(/price=25-50/);
        await expect(this.removeFilterLnk).toBeVisible();

        const filteredPriceTexts = await this.productPrices.allInnerTexts();
        const filteredPrices = filteredPriceTexts.map((priceText) =>
            Number.parseFloat(priceText.replace(/[^0-9.]/g, ''))
        );
        const filteredProductCount = await this.productItems.count();
        expect(filteredPriceTexts.length).toBe(filteredProductCount);
        expect(filteredPrices.every((price) => Number.isFinite(price))).toBeTruthy();

        for (const price of filteredPrices) {
            expect(price).toBeGreaterThanOrEqual(TC_02_BooksCategory.minPrice);
            expect(price).toBeLessThanOrEqual(TC_02_BooksCategory.maxPrice);
        }
        console.log(`Price filter returned ${filteredProductCount} products; all returned prices are within ${TC_02_BooksCategory.priceFilterLabel}`);
        return filteredProductCount;
    }

    async removePriceFilterAndVerify(initialProductNames: string[],  filteredProductCount: number,  selectedPageSize: number
    ): Promise<void>{
        await this.removeFilterLnk.click();
        await expect(this.page).not.toHaveURL(/price=25-50/);
        await expect(this.booksHdr).toBeVisible();

        const restoredProductNames = await this.productTitles.allInnerTexts();
        expect(restoredProductNames.length).toBeGreaterThan(filteredProductCount);
        expect(restoredProductNames.length).toBeLessThanOrEqual(selectedPageSize);
        expect(restoredProductNames.some((productName) => initialProductNames.includes(productName))).toBeTruthy();
        await expect(this.viewLayOut).toBeVisible();
        console.log('Price filter removed; the broader Books listing and selected layout are restored');
    }

    async openProductCategory(): Promise<void>{
        console.log('Opening the Computers > Notebooks category');
        await this.header.openComputers();
        await this.NotebookLnk.click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.DemoWebShop.notebooksURL}$`));
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