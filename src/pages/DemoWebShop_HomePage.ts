import { Page, Locator, expect } from "@playwright/test";
import { TC_01_Authentication } from "../../test-data/demoWebShop";

export class DemoWebShop_HomePage{
    page: Page;
    private loginLink:Locator;
    private demoWebShopHdr: Locator;
    private registerLnk: Locator;   
    private demoWebShopLnk: Locator;    
    private accountEmailLink: Locator;

    constructor(page: Page){
        this.page = page;
        this.loginLink = page.getByRole('link', { name: 'Log in', exact: true });
        this.demoWebShopHdr = page.getByRole('heading', { name: TC_01_Authentication.headings.home });
        this.registerLnk = page.getByRole('link', { name: 'Register', exact: true });
        this.demoWebShopLnk = page.getByRole('link', { name: 'Tricentis Demo Web Shop' });
        this.accountEmailLink = page.getByRole('link', { name: TC_01_Authentication.email, exact: true });
    }

    async clickLoginLink(): Promise<void>{
        console.log('Opening the Login page');
        await this.loginLink.click();
        await expect(this.page).toHaveURL('https://demowebshop.tricentis.com/login');
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
	    await expect(this.page).toHaveURL('https://demowebshop.tricentis.com/');
	    await expect(this.demoWebShopHdr).toBeVisible();
    }


}