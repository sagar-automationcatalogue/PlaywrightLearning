import { Page, Locator, expect } from "@playwright/test";
import { Constants } from "../constants/constants";
import { HeaderComponents } from "../components/HeaderComponents";

export class DemoWebShop_HomePage{
    page: Page;
    private demoWebShopHdr: Locator;
    private registerLnk: Locator;   
    private booksHomeHeading: Locator;
    private header: HeaderComponents;

    constructor(page: Page){
        this.page = page;
        this.header = new HeaderComponents(page);
        this.demoWebShopHdr = page.getByRole('heading', { name: Constants.DemoWebShop.headings.home, exact: true });
        this.registerLnk = page.getByRole('link', { name: 'Register', exact: true });
        this.booksHomeHeading = page.getByRole('heading', { name: Constants.DemoWebShop.homeHeading, exact: true });
    }

    async openDemoWebShopAndVerifyHomePage(): Promise<void>{
        console.log('Opening Demo Web Shop');
        await expect(this.booksHomeHeading).toBeVisible();
        console.log('Home page is displayed');
    }

    async clickLoginLink(): Promise<void>{
        console.log('Opening the Login page');
        await this.header.openLogin();
    }

    async verifyDemoWebshopLinks():Promise<void>{
        await expect(this.demoWebShopHdr).toBeVisible();
        await expect(this.registerLnk).toBeVisible();	    
	    await this.header.verifyLoggedOutState();
	    console.log('Home page loaded and Register/Login links are visible');
    }

    async verifyDemoWebShopHome(){
        await this.header.openHome();
	    await expect(this.demoWebShopHdr).toBeVisible();
    }


}