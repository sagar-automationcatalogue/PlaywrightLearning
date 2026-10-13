import { Page, Locator, expect } from "@playwright/test";
import { TC_01_Authentication } from "../../test-data/demoWebShop";

export class DemoWebShop_CustomerInfoPage{

    private customerInfoHdr: Locator;

    constructor(page: Page){
        this.customerInfoHdr = page.getByRole('heading', { name: TC_01_Authentication.headings.account });
    }

    async verifyCustomerInfoPage(){
        await expect(this.customerInfoHdr).toBeVisible();
    }

}