import { Page, Locator } from "@playwright/test";

export class DemoWebShop_OrdersPage {
    private thankYouTxt: Locator;
    private orderConfirmationTxt: Locator;
    private orderNumberItem: Locator;

    constructor(page: Page) {
        this.thankYouTxt = page.getByText('Thank you', { exact: true });
        this.orderConfirmationTxt = page.locator('strong');
        this.orderNumberItem = page.getByRole('listitem').filter({ hasText: /Order number:/i });
    }
}