import { Page, Locator, expect } from '@playwright/test';

export class PracticeSoftware_FavoritesPage {
    private mainMenu: Locator;
    private favoritesHeading: Locator;
    private favoriteCardTitles: Locator;
    private favoritesMenuLink: Locator;
    private accountMenuLink: Locator;

    constructor(private page: Page) {
        this.mainMenu = page.getByRole('menubar', { name: 'Main menu' });
        this.favoritesHeading = page.getByRole('heading', { name: 'Favorites', exact: true });
        this.favoriteCardTitles = page.locator('.card-title');
        this.favoritesMenuLink = this.mainMenu.getByRole('link', { name: /my favorites/i });
        this.accountMenuLink = this.mainMenu.getByRole('link', { name: /my account/i });
    }

    private async openFavoritesFromMenu(): Promise<void> {
        await this.mainMenu.getByRole('menuitem').last().getByRole('button').click();
        await this.favoritesMenuLink.click();
        await expect(this.favoritesHeading).toBeVisible();
    }

    async clearExistingFavoritesFromHome(): Promise<void> {
        await this.openFavoritesFromMenu();
        const existingNames = (await this.favoriteCardTitles.allInnerTexts())
            .map(name => name.trim())
            .filter(Boolean);
        for (const existingName of existingNames) {
            const deletion = this.page.waitForResponse(response =>
                /\/favorites\//i.test(new URL(response.url()).pathname) && response.request().method() === 'DELETE'
            );
            await this.page.getByRole('heading', { name: existingName, exact: true })
                .locator('xpath=ancestor::div[.//button][1]')
                .getByRole('button')
                .click();
            expect((await deletion).status()).toBe(204);
        }
    }

    async openFavoritesFromHomeViaAccount(): Promise<void> {
        await this.mainMenu.getByRole('menuitem').last().getByRole('button').click();
        await this.accountMenuLink.click();
        await expect(this.page).toHaveURL(/\/account/);
        const accountMenu = this.page.getByRole('menubar', { name: 'Main menu' });
        await accountMenu.getByRole('menuitem').last().getByRole('button').click();
        await accountMenu.getByRole('link', { name: /my favorites/i }).click();
        await expect(this.page).toHaveURL(/\/account\/favorites/);
    }

    async verifyBothFavoritesAndRemove(
        firstProductName: string,
        secondProductName: string
    ): Promise<void> {
        await expect(this.favoritesHeading).toBeVisible();
        const firstProductHeading = this.page.getByRole('heading', { name: firstProductName, exact: true });
        const secondProductHeading = this.page.getByRole('heading', { name: secondProductName, exact: true });
        await expect(firstProductHeading).toBeVisible();
        await expect(secondProductHeading).toBeVisible();
        expect(await this.page.getByRole('heading').count()).toBeGreaterThanOrEqual(3);

        const firstProductCard = firstProductHeading.locator('xpath=ancestor::div[.//button][1]');
        const removeFirstProduct = this.page.waitForResponse(response =>
            /\/favorites\//i.test(new URL(response.url()).pathname) && response.request().method() === 'DELETE'
        );
        await firstProductCard.getByRole('button').click();
        expect((await removeFirstProduct).status()).toBe(204);
        await expect(firstProductHeading).toHaveCount(0);
        await expect(secondProductHeading).toBeVisible();

        const secondProductCard = secondProductHeading.locator('xpath=ancestor::div[.//button][1]');
        const removeSecondProduct = this.page.waitForResponse(response =>
            /\/favorites\//i.test(new URL(response.url()).pathname) && response.request().method() === 'DELETE'
        );
        await secondProductCard.getByRole('button').click();
        expect((await removeSecondProduct).status()).toBe(204);
        await expect(secondProductHeading).toHaveCount(0);
    }

    async signOutFromHome(): Promise<void> {
        await this.mainMenu.getByRole('menuitem').last().getByRole('button').click();
        await this.mainMenu.getByText('Sign out', { exact: true }).click();
        await expect(this.page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
    }
}
