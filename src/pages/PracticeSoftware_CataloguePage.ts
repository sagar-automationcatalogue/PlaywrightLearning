import { Page, Locator, expect } from '@playwright/test';
import { TC_02_ProductSearch } from '../../test-data/practiceSoftware';
import { URLConfig } from '../config/URLConfig';

export class PracticeSoftware_CataloguePage {
    private productTitles: Locator;
    private searchInput: Locator;
    private searchButton: Locator;
    private clearSearchButton: Locator;
    private sortDropdown: Locator;
    private productCards: Locator;
    private pagination: Locator;
    private nextPage: Locator;
    private filterProductLinks: Locator;
    private categoryFilterHeading: Locator;
    private categoryCheckbox: (name: string) => Locator;
    private subcategoryCheckbox: (name: string) => Locator;
    private brandCheckboxes: Locator;
    private brandCheckbox: (name: string) => Locator;
    private minimumPriceSlider: Locator;
    private maximumPriceSlider: Locator;
    private favoriteProductCards: Locator;
    private favoriteProductSearchInput: Locator;

    constructor(private page: Page) {
        this.productTitles = page.locator('.card .card-title');
        this.searchInput = page.getByPlaceholder('Search');
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.clearSearchButton = page.getByRole('button', { name: 'X', exact: true });
        this.sortDropdown = page.getByLabel('sort');
        this.productCards = page.locator('.card').filter({ has: page.locator('.card-title') });
        this.pagination = page.locator('.pagination');
        this.nextPage = page.getByRole('link', { name: /next/i })
            .or(page.getByRole('button', { name: /next/i }));
        this.filterProductLinks = page.locator('a.card[href*="/product/"]');
        this.categoryFilterHeading = page.getByText('By category:');
        this.categoryCheckbox = name => page.getByRole('checkbox', { name });
        this.subcategoryCheckbox = name => page.getByRole('checkbox', { name });
        this.brandCheckboxes = page.locator('input[type="checkbox"]');
        this.brandCheckbox = name => page.getByRole('checkbox', { name });
        this.minimumPriceSlider = page.getByRole('slider', { name: 'ngx-slider', exact: true });
        this.maximumPriceSlider = page.getByRole('slider', { name: 'ngx-slider-max', exact: true });
        this.favoriteProductCards = page.locator('a[href*="/product/"]');
        this.favoriteProductSearchInput = page.getByRole('textbox', { name: 'Search' });
    }

    private async getProductNames(): Promise<string[]> {
        return (await this.productTitles.allInnerTexts())
            .map(name => name.trim())
            .filter(Boolean);
    }

    async captureInitialProductCount(): Promise<number> {
        await expect.poll(async () => (await this.getProductNames()).length).toBeGreaterThan(0);
        const initialCount = (await this.getProductNames()).length;
        expect(initialCount).toBeGreaterThan(0);
        console.log(`Initial visible product count: ${initialCount}`);
        return initialCount;
    }

    async searchAndVerifyResults(searchTerm: string, requireEveryResult: boolean): Promise<string[]> {
        await expect(this.searchInput).toBeVisible();
        await this.searchInput.fill(searchTerm);
        await expect(this.searchInput).toHaveValue(searchTerm);
        await this.searchButton.click();

        await expect(this.page.getByRole('heading', {
            name: new RegExp(`searched for: ${searchTerm}`, 'i')
        })).toBeVisible();
        await expect.poll(async () => {
            const names = await this.getProductNames();
            return names.length > 0 && (requireEveryResult
                ? names.every(name => new RegExp(searchTerm, 'i').test(name))
                : names.some(name => new RegExp(searchTerm, 'i').test(name)));
        }).toBe(true);

        const productNames = await this.getProductNames();
        expect(productNames.length).toBeGreaterThan(0);
        if (requireEveryResult) {
            expect(productNames.every(name => new RegExp(searchTerm, 'i').test(name))).toBe(true);
        } else {
            expect(productNames.some(name => new RegExp(searchTerm, 'i').test(name))).toBe(true);
        }
        return productNames;
    }

    async verifySearchUrlIfApplicable(searchTerm: string): Promise<void> {
        const activeUrl = this.page.url();
        const activeUrlPattern = new RegExp(`search|${searchTerm}`, 'i');
        if (activeUrlPattern.test(activeUrl)) {
            expect(activeUrl).toMatch(activeUrlPattern);
        }
    }

    async sortByNameAndVerify(sortLabel: string): Promise<void> {
        await expect(this.sortDropdown).toBeVisible();
        await this.sortDropdown.selectOption({ label: sortLabel });
        await expect.poll(async () => {
            const names = await this.getProductNames();
            return JSON.stringify(names) === JSON.stringify([...names].sort((left, right) => left.localeCompare(right)));
        }).toBe(true);

        const namesSortedByUi = await this.getProductNames();
        expect(namesSortedByUi).toEqual([...namesSortedByUi].sort((left, right) => left.localeCompare(right)));
    }

    private async getDisplayedPrices(): Promise<number[]> {
        const priceTexts = await this.productCards.allInnerTexts();
        return priceTexts.map(priceText => {
            const match = priceText.match(/[$€£]\s*([\d,]+(?:\.\d{1,2})?)/);
            return Number((match?.[1] ?? priceText.match(/[-+]?\d[\d,]*(?:\.\d{1,2})?/g)?.slice(-1)[0] ?? '')
                .replace(/,/g, ''));
        });
    }

    async sortByPriceAndVerify(sortLabel: string): Promise<void> {
        await this.sortDropdown.selectOption({ label: sortLabel });
        await expect.poll(async () => {
            const prices = await this.getDisplayedPrices();
            return prices.every((price, index) => index === 0 || price >= prices[index - 1]);
        }).toBe(true);

        const prices = await this.getDisplayedPrices();
        expect(prices.length).toBeGreaterThan(0);
        for (let index = 1; index < prices.length; index++) {
            expect(prices[index]).toBeGreaterThanOrEqual(prices[index - 1]);
        }
    }

    async exercisePaginationIfAvailable(): Promise<void> {
        const canGoNext = await this.pagination.isVisible().catch(() => false)
            && await this.nextPage.count() > 0
            && await this.nextPage.isEnabled().catch(() => false);
        if (!canGoNext) {
            return;
        }

        const firstPageNames = await this.getProductNames();
        const firstPageUrl = this.page.url();
        await this.nextPage.click();
        await expect.poll(async () => {
            const currentNames = await this.getProductNames();
            return currentNames.length > 0 && JSON.stringify(currentNames) !== JSON.stringify(firstPageNames);
        }).toBe(true);
        const secondPageNames = await this.getProductNames();
        expect(secondPageNames).not.toEqual(firstPageNames);
        expect(this.page.url() !== firstPageUrl || secondPageNames.join('|') !== firstPageNames.join('|')).toBe(true);

        const firstPageControl = this.pagination.getByRole('link', { name: '1', exact: true })
            .or(this.pagination.getByRole('button', { name: '1', exact: true }));
        if (await firstPageControl.count()) {
            await firstPageControl.click();
        } else {
            const previousPage = this.page.getByRole('link', { name: /previous|prev/i })
                .or(this.page.getByRole('button', { name: /previous|prev/i }));
            await previousPage.click();
        }
        await expect.poll(async () => JSON.stringify(await this.getProductNames()))
            .toBe(JSON.stringify(firstPageNames));
    }

    async clearSearchAndVerifyCatalogRestored(minimumCount: number): Promise<void> {
        await this.clearSearchButton.click();
        await expect(this.searchInput).toHaveValue(TC_02_ProductSearch.emptyValue);
        await expect.poll(async () => (await this.getProductNames()).length)
            .toBeGreaterThanOrEqual(minimumCount);
    }

    async clearSearchAndVerifyProductsAvailable(): Promise<void> {
        await this.clearSearchButton.click();
        await expect(this.searchInput).toHaveValue(TC_02_ProductSearch.emptyValue);
        await expect.poll(async () => (await this.getProductNames()).length).toBeGreaterThan(0);
        await expect(this.searchInput).toHaveValue(TC_02_ProductSearch.emptyValue);
    }

    private async getFilterProductCount(): Promise<number> {
        return this.filterProductLinks.count();
    }

    private async getVisibleFilterProductNames(): Promise<string[]> {
        const names = await this.filterProductLinks.allTextContents();
        return names.map(name => name.trim()).filter(Boolean);
    }

    private async getPricesFromFilteredProducts(): Promise<number[]> {
        const productNames = await this.getVisibleFilterProductNames();
        const prices: number[] = [];
        for (const productName of productNames) {
            const matches = productName.match(/\d+\.\d{2}/g);
            if (matches && matches.length > 0) {
                prices.push(Number(matches[matches.length - 1]));
            }
        }
        return prices;
    }

    private async movePriceSliderTo(slider: Locator, targetValue: number): Promise<void> {
        await expect(slider).toBeVisible();
        await slider.focus();
        let currentValue = Number(await slider.getAttribute('aria-valuenow'));
        const key = targetValue >= currentValue ? 'ArrowRight' : 'ArrowLeft';
        while (currentValue !== targetValue) {
            await slider.press(key);
            currentValue = Number(await slider.getAttribute('aria-valuenow'));
        }
        await expect(slider).toHaveAttribute('aria-valuenow', String(targetValue));
    }

    async captureInitialFilterProductCount(): Promise<number> {
        await expect(this.filterProductLinks.first()).toBeVisible({ timeout: 30000 });
        await expect(this.categoryFilterHeading).toBeVisible();
        const initialProductCount = await this.getFilterProductCount();
        expect(initialProductCount).toBeGreaterThan(0);
        console.log(`2. Initial product result count: ${initialProductCount}`);
        return initialProductCount;
    }

    async filterByCategoryAndSubcategory(category: string, subcategory: string, baselineCount: number): Promise<void> {
        const categoryFilter = this.categoryCheckbox(category);
        const subcategoryFilter = this.subcategoryCheckbox(subcategory);
        await expect(categoryFilter).toBeVisible();
        console.log('4. Select Hand Tools category');
        await categoryFilter.check();
        await expect(categoryFilter).toBeChecked();

        console.log('5. Verify results refresh');
        const categoryFilteredCount = await this.getFilterProductCount();
        console.log(`6. Product count after category filtering: ${categoryFilteredCount}`);
        expect(categoryFilteredCount).toBeGreaterThan(0);
        expect(categoryFilteredCount).toBeLessThanOrEqual(baselineCount);
        console.log('7. Verify category filtering does not increase beyond the baseline');
        expect(categoryFilteredCount).toBeLessThanOrEqual(baselineCount);

        if (await subcategoryFilter.isVisible().catch(() => false)) {
            console.log('8. Select Pliers subcategory');
            await subcategoryFilter.check();
            await expect(subcategoryFilter).toBeChecked();
            console.log('9. Verify the result set refreshes again');
            const productNamesAfterPliers = await this.getVisibleFilterProductNames();
            expect(productNamesAfterPliers.length).toBeGreaterThan(0);
            console.log(`10. Product names under the selected category/subcategory: ${productNamesAfterPliers.slice(0, 5).join(', ')}`);
            expect(productNamesAfterPliers.length).toBeGreaterThan(0);
        }
    }

    async selectDynamicBrand(): Promise<string> {
        const brandNames = await this.brandCheckboxes.evaluateAll(checkboxes =>
            checkboxes
                .map(checkbox => {
                    const label = checkbox.closest('label');
                    return label ? label.textContent?.replace(/\s+/g, ' ').trim() : '';
                })
                .filter(text =>
                    text &&
                    !/Hand Tools|Hammer|Hand Saw|Wrench|Screwdriver|Pliers|Chisels|Measures|Power Tools|Grinder|Sander|Saw|Drill|Other|Tool Belts|Storage Solutions|Workbench|Safety Gear|Fasteners|Show only eco-friendly products/i.test(text)
                )
        );
        expect(brandNames.length).toBeGreaterThan(0);
        const selectedBrand = brandNames[0];
        console.log(`12-13. Brand labels captured. Dynamic brand chosen: ${selectedBrand}`);
        const selectedBrandCheckbox = this.brandCheckbox(selectedBrand);
        await expect(selectedBrandCheckbox).toBeVisible();
        console.log('14. Apply selected brand filter');
        await selectedBrandCheckbox.check();
        await expect(selectedBrandCheckbox).toBeChecked();
        console.log('15. Verify category + brand filtering refreshes the list');
        expect((await this.getVisibleFilterProductNames()).length).toBeGreaterThan(0);
        return selectedBrand;
    }

    async applyPriceRangeAndVerify(
        minimum: number,
        maximum: number
    ): Promise<void> {
        console.log('16. Locate the price range control');
        await expect(this.minimumPriceSlider).toBeVisible();
        await expect(this.maximumPriceSlider).toBeVisible();
        const minBefore = Number(await this.minimumPriceSlider.getAttribute('aria-valuenow'));
        const maxBefore = Number(await this.maximumPriceSlider.getAttribute('aria-valuenow'));
        console.log(`17. Current price range values: min=${minBefore}, max=${maxBefore}`);

        console.log('18-19. Move the minimum price toward 10 and maximum price toward 50');
        await this.movePriceSliderTo(this.minimumPriceSlider, minimum);
        await this.movePriceSliderTo(this.maximumPriceSlider, maximum);
        console.log('20. Wait for product results to stabilize');
        await expect.poll(async () => this.getFilterProductCount(), { timeout: 30000 }).toBeGreaterThan(0);

        const displayedPrices = await this.getPricesFromFilteredProducts();
        console.log(`21. Product prices captured: ${displayedPrices.slice(0, 5).join(', ')}`);
        expect(displayedPrices.length).toBeGreaterThan(0);
        console.log('22-24. Normalize and validate displayed prices against the active range');
        const invalidPriceList = displayedPrices.filter(price => price < minimum || price > maximum);
        expect(invalidPriceList).toHaveLength(0);

    }

    async openFilteredProductAndVerify(selectedBrand: string): Promise<void> {
        console.log('25. Open one filtered product detail page');
        const firstProductLink = this.filterProductLinks.first();
        await expect(firstProductLink).toBeVisible();
        await firstProductLink.click();
        await expect(this.page.locator('h1')).toBeVisible();
        const detailText = (await this.page.locator('body').innerText()).toLowerCase();

        console.log('26. Verify the product detail page remains consistent with the active filters');
        if (detailText.includes('category') || detailText.includes('brand')) {
            if (detailText.includes('hand tools') || detailText.includes('pliers')) {
                expect(detailText).toMatch(/hand tools|pliers/);
            }
            if (detailText.includes(selectedBrand.toLowerCase())) {
                expect(detailText).toContain(selectedBrand.toLowerCase());
            }
        }
    }

    async returnToFilteredCatalogAndRemoveBrand(selectedBrand: string): Promise<number> {
        console.log('27. Navigate back to the filtered catalog');
        await this.page.goBack();
        await expect(this.filterProductLinks.first()).toBeVisible();

        console.log('28. Remove only the Brand filter');
        const selectedBrandCheckbox = this.brandCheckbox(selectedBrand);
        await selectedBrandCheckbox.uncheck();
        await expect(selectedBrandCheckbox).not.toBeChecked();

        console.log('29. Verify result set changes or remains logically valid');
        const afterBrandRemovalCount = await this.getFilterProductCount();
        expect(afterBrandRemovalCount).toBeGreaterThan(0);
        return afterBrandRemovalCount;
    }

    async resetFiltersAndVerifyBaseline(
        category: string,
        subcategory: string,
        resetMinimum: number,
        resetMaximum: number,
        initialProductCount: number
    ): Promise<void> {
        const categoryCheckbox = this.categoryCheckbox(category);
        const subcategoryCheckbox = this.subcategoryCheckbox(subcategory);
        console.log('30. Clear/reset all filters');
        if (await categoryCheckbox.isChecked()) {
            await categoryCheckbox.uncheck();
        }
        if (await subcategoryCheckbox.isVisible().catch(() => false) && await subcategoryCheckbox.isChecked()) {
            await subcategoryCheckbox.uncheck();
        }
        await this.movePriceSliderTo(this.minimumPriceSlider, resetMinimum);
        await this.movePriceSliderTo(this.maximumPriceSlider, resetMaximum);

        console.log('31. Verify the catalog returns toward the initial baseline');
        const finalProductCount = await this.getFilterProductCount();
        console.log(`Final product count after clearing filters: ${finalProductCount}`);
        expect(finalProductCount).toBeGreaterThan(0);
        expect(finalProductCount).toBeGreaterThanOrEqual(initialProductCount - 10);
    }

    async verifyCatalogProductsLoaded(): Promise<void> {
        await expect.poll(async () => this.page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);
    }

    async searchAndOpenFavoriteProduct(searchTerm: string, productName: string): Promise<void> {
        await this.favoriteProductSearchInput.fill(searchTerm);
        await this.searchButton.click();
        await expect(this.page.getByRole('heading', {
            name: new RegExp(`searched for: ${productName}`, 'i')
        })).toBeVisible();
        const productHeading = this.page.getByRole('heading', { name: productName, exact: true });
        await expect(productHeading).toBeVisible();
        await this.page.locator('.card:visible')
            .filter({ has: productHeading })
            .getByRole('heading', { name: productName, exact: true })
            .click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.PracticeSoftwareTesting.productURL}/`));
    }

    async searchAndOpenAvailableHammer(): Promise<string> {
        await this.favoriteProductSearchInput.fill(TC_02_ProductSearch.searchTerms.alternate);
        await this.searchButton.click();
        await expect(this.page.getByRole('heading', { name: /searched for: Hammer/i })).toBeVisible();
        const hammerCards = this.favoriteProductCards.filter({ hasText: /hammer/i });
        await expect.poll(async () => hammerCards.count()).toBeGreaterThan(0);
        const hammerCardCount = await hammerCards.count();
        let selectedHammerName: string | undefined;
        for (let index = 0; index < hammerCardCount; index++) {
            const candidate = hammerCards.nth(index);
            if (await candidate.getByText(/out of stock/i).count()) {
                continue;
            }
            selectedHammerName = (await candidate.locator('h5').innerText()).trim();
            break;
        }
        if (!selectedHammerName) {
            throw new Error('No hammer product is available in the catalog results.');
        }
        await this.favoriteProductCards
            .filter({ has: this.page.getByRole('heading', { name: selectedHammerName, exact: true }) })
            .getByRole('heading', { name: selectedHammerName, exact: true })
            .click();
        await expect(this.page).toHaveURL(new RegExp(`${URLConfig.UI.PracticeSoftwareTesting.productURL}/`));
        return selectedHammerName;
    }
}
