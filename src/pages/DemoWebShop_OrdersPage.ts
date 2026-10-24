import { Page, Locator, expect } from "@playwright/test";
import { URLConfig } from "../config/URLConfig";

export class DemoWebShop_OrdersPage {
    private page: Page;
    private thankYouTxt: Locator;
    private orderConfirmationTxt: Locator;
    private orderNumberItem: Locator;

    constructor(page: Page) {
        this.page = page;
        this.thankYouTxt = page.getByText('Thank you', { exact: true });
        this.orderConfirmationTxt = page.locator('strong');
        this.orderNumberItem = page.getByRole('listitem').filter({ hasText: /Order number:/i });
    }

    async verifyOrderNumber(): Promise<void>{
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.DemoWebShop.completedOrderURL));
        await expect(this.thankYouTxt).toBeVisible();
        await expect(this.orderConfirmationTxt).toContainText('Your order has been successfully processed');        
        await expect(this.orderNumberItem).toHaveCount(1);
        const orderNumberText = await this.orderNumberItem.innerText();
        const orderNumberMatch = orderNumberText.match(/Order number:\s*(\d+)/i);
        expect(orderNumberMatch).not.toBeNull();
        if (orderNumberMatch === null) {
            throw new Error(`Could not extract the order number from: ${orderNumberText}`);
        }
        const orderNumber = orderNumberMatch[1];
        console.log('Order number:', orderNumber);
    }
}