import { Page, Locator, expect } from "@playwright/test";
import { TC_01_Authentication, TC_02_BooksCategory } from "../../test-data/demoWebShop";
import {demoWebShopBaseURL, joinBaseURL} from '../config/EnvironmentConfig';
import {URLConfig} from '../config/URLConfig';
import { Constants } from "../constants/constants";

export class DemoWebShop_HomePage{
    page: Page;
    private loginLink:Locator;
    private demoWebShopHdr: Locator;
    private registerLnk: Locator;   
    private demoWebShopLnk: Locator;    
    private accountEmailLink: Locator;
    private booksHomeHeading: Locator;

    constructor(page: Page){
        this.page = page;
        this.loginLink = page.getByRole('link', { name: 'Log in', exact: true });
        this.demoWebShopHdr = page.getByRole('heading', { name: Constants.DemoWebShop.headings.home, exact: true });
        this.registerLnk = page.getByRole('link', { name: 'Register', exact: true });
        this.demoWebShopLnk = page.getByRole('link', { name: 'Tricentis Demo Web Shop' });
        this.accountEmailLink = page.getByRole('link', { name: TC_01_Authentication.email, exact: true });
        this.booksHomeHeading = page.getByRole('heading', { name: Constants.DemoWebShop.homeHeading, exact: true });
    }

    async openDemoWebShopAndVerifyHomePage(): Promise<void>{
        console.log('Opening Demo Web Shop');
        await this.page.goto(demoWebShopBaseURL);
        await expect(this.booksHomeHeading).toBeVisible();
        console.log('Home page is displayed');
    }

    async clickLoginLink(): Promise<void>{
        console.log('Opening the Login page');
        await this.loginLink.click();
        await expect(this.page).toHaveURL(joinBaseURL(demoWebShopBaseURL, URLConfig.UI.DemoWebShop.loginURL));
    }

    async verifyDemoWebshopLinks():Promise<void>{
        await expect(this.demoWebShopHdr).toBeVisible();
        await expect(this.registerLnk).toBeVisible();	    
	    await expect(this.loginLink).toBeVisible();
        await expect(this.accountEmailLink).toHaveCount(0);
	    console.log('Home page loaded and Register/Login links are visible');
    }

    async verifyDemoWebShopHome(){
        await this.demoWebShopLnk.click();
	    await expect(this.page).toHaveURL(demoWebShopBaseURL);
	    await expect(this.demoWebShopHdr).toBeVisible();
    }


}