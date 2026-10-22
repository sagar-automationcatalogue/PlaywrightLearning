import { Page, Locator, expect } from '@playwright/test';

export class PracticeSoftware_ProductPage {
    private favoriteButton: Locator;
    private addToCartButton: Locator;
    private favoriteAlert: Locator;

    constructor(private page: Page) {
        this.favoriteButton = page.getByRole('button', { name: /add to favourites/i });
        this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
        this.favoriteAlert = page.getByRole('alert');
    }

    async addToFavorites(): Promise<void> {
        await expect(this.favoriteButton).toBeVisible();
        const favoriteResponse = this.page.waitForResponse(response =>
            response.url().endsWith('/favorites') && response.request().method() === 'POST'
        );
        await this.favoriteButton.click();
        const response = await favoriteResponse;
        if (!response.ok()) {
            await expect(this.favoriteAlert).toContainText(/already in your favorites/i);
        }
    }

    async verifyAvailableAndAddToFavorites(): Promise<void> {
        await expect(this.addToCartButton).toBeEnabled();
        await this.addToFavorites();
    }

    async verifyFavoriteActionVisible(): Promise<void> {
        await expect(this.page.getByRole('button', { name: /favourites?/i }).first()).toBeVisible();
    }
}
