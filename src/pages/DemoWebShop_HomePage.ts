import { Page, Locator } from "@playwright/test";

export class DemoWebShop_HomePage{
    private loginLink:Locator;

    constructor(page: Page){
        this.loginLink = page.getByRole('link', { name: 'Log in', exact: true });
    }
}