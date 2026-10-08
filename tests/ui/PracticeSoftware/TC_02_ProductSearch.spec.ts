import { expect, test } from '@playwright/test';
import { TC_02_ProductSearch } from '../../../test-data/practiceSoftware.ts';

test('@sanity TC_02_ProductSearch: Search → Sort → Pagination → Reset', async ({ page }) => {
    const homeUrl = 'https://practicesoftwaretesting.com/';
    await page.goto(homeUrl);
    const mainNavigation = page.getByRole('navigation').filter({
        has: page.getByRole('menubar', { name: 'Main menu' }),
    });
    await expect(mainNavigation).toBeVisible();

    // The catalog is populated asynchronously after the application shell renders.
    await expect.poll(async () => (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean).length).toBeGreaterThan(0);
    const initialNames = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
    expect(initialNames.length).toBeGreaterThan(0);
    const initialCount = initialNames.length;
    console.log(`Initial visible product count: ${initialCount}`);

    const searchInput = page.getByPlaceholder('Search');
    await expect(searchInput).toBeVisible();
    await searchInput.fill(TC_02_ProductSearch.searchTerms.primary);
    await expect(searchInput).toHaveValue(TC_02_ProductSearch.searchTerms.primary);
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await expect(page.getByRole('heading', {
        name: new RegExp(`searched for: ${TC_02_ProductSearch.searchTerms.primary}`, 'i')
    })).toBeVisible();
    await expect.poll(async () => {
        const names = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
        return names.length > 0 && names.every(name => new RegExp(TC_02_ProductSearch.searchTerms.primary, 'i').test(name));
    }).toBe(true);
    const pliersNames = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
    expect(pliersNames.length).toBeGreaterThan(0);
    expect(pliersNames.every(name => new RegExp(TC_02_ProductSearch.searchTerms.primary, 'i').test(name))).toBe(true);
    console.log('Pliers search results:', pliersNames);

    const activeUrl = page.url();
    const activeUrlPattern = new RegExp(`search|${TC_02_ProductSearch.searchTerms.primary}`, 'i');
    if (activeUrlPattern.test(activeUrl)) {
        expect(activeUrl).toMatch(activeUrlPattern);
    }

    // Sort product names A-Z and compare the displayed order with localeCompare.
    const sortDropdown = page.getByLabel('sort');
    await expect(sortDropdown).toBeVisible();
    await sortDropdown.selectOption({ label: TC_02_ProductSearch.sortByName });
    await expect.poll(async () => {
        const names = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
        return JSON.stringify(names) === JSON.stringify([...names].sort((left, right) => left.localeCompare(right)));
    }).toBe(true);
    const namesSortedByUi = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
    const expectedNames = [...namesSortedByUi].sort((left, right) => left.localeCompare(right));
    expect(namesSortedByUi).toEqual(expectedNames);

    // Sort by ascending price and verify every adjacent pair is ordered.
    await sortDropdown.selectOption({ label: TC_02_ProductSearch.sortByPrice });
    const displayedCards = page.locator('.card').filter({ has: page.locator('.card-title') });
    await expect.poll(async () => {
        const currentPriceTexts = await displayedCards.allInnerTexts();
        const currentPrices = currentPriceTexts.map(priceText => { const match = priceText.match(/[$€£]\s*([\d,]+(?:\.\d{1,2})?)/); return Number((match?.[1] ?? priceText.match(/[-+]?\d[\d,]*(?:\.\d{1,2})?/g)?.slice(-1)[0] ?? '').replace(/,/g, '')); });
        return currentPrices.every((price, index) => index === 0 || price >= currentPrices[index - 1]);
    }).toBe(true);
    const priceTexts = await displayedCards.allInnerTexts();
    const prices = priceTexts.map(priceText => { const match = priceText.match(/[$€£]\s*([\d,]+(?:\.\d{1,2})?)/); return Number((match?.[1] ?? priceText.match(/[-+]?\d[\d,]*(?:\.\d{1,2})?/g)?.slice(-1)[0] ?? '').replace(/,/g, '')); });
    expect(prices.length).toBeGreaterThan(0);
    for (let index = 1; index < prices.length; index++) {
        expect(prices[index]).toBeGreaterThanOrEqual(prices[index - 1]);
    }

    // Search results may fit on one page; exercise pagination only when Next is available.
    const pagination = page.locator('.pagination');
    const nextPage = page.getByRole('link', { name: /next/i })
        .or(page.getByRole('button', { name: /next/i }));
    const canGoNext = await pagination.isVisible().catch(() => false)
        && await nextPage.count() > 0
        && await nextPage.isEnabled().catch(() => false);
    if (canGoNext) {
        const firstPageNames = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
        const firstPageUrl = page.url();
        await nextPage.click();
        await expect.poll(async () => {
            const currentNames = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
            return currentNames.length > 0 && JSON.stringify(currentNames) !== JSON.stringify(firstPageNames);
        }).toBe(true);
        const secondPageNames = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
        expect(secondPageNames).not.toEqual(firstPageNames);
        expect(page.url() !== firstPageUrl || secondPageNames.join('|') !== firstPageNames.join('|')).toBe(true);

        const firstPageControl = pagination.getByRole('link', { name: '1', exact: true })
            .or(pagination.getByRole('button', { name: '1', exact: true }));
        if (await firstPageControl.count()) {
            await firstPageControl.click();
        } else {
            const previousPage = page.getByRole('link', { name: /previous|prev/i })
                .or(page.getByRole('button', { name: /previous|prev/i }));
            await previousPage.click();
        }
        await expect.poll(async () => JSON.stringify((await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean)))
            .toBe(JSON.stringify(firstPageNames));
    }

    // Clear the query and confirm the broader catalog is restored.
    await page.getByRole('button', { name: 'X', exact: true }).click();
    await expect(searchInput).toHaveValue(TC_02_ProductSearch.emptyValue);
    await expect.poll(async () => (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean).length)
        .toBeGreaterThanOrEqual(initialCount);

    // Run an independent hammer search, then clear it again.
    await searchInput.fill(TC_02_ProductSearch.searchTerms.alternate);
    await expect(searchInput).toHaveValue(TC_02_ProductSearch.searchTerms.alternate);
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByRole('heading', {
        name: new RegExp(`searched for: ${TC_02_ProductSearch.searchTerms.alternate}`, 'i')
    })).toBeVisible();
    await expect.poll(async () => (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean).length).toBeGreaterThan(0);
    const hammerNames = (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean);
    expect(hammerNames.some(name => new RegExp(TC_02_ProductSearch.searchTerms.alternate, 'i').test(name))).toBe(true);

    await page.getByRole('button', { name: 'X', exact: true }).click();
    await expect(searchInput).toHaveValue('');
    await expect.poll(async () => (await page.locator('.card .card-title').allInnerTexts()).map(name => name.trim()).filter(Boolean).length).toBeGreaterThan(0);
    await expect(searchInput).toHaveValue('');
});
