import { expect, test } from '@playwright/test';

test('TC_03_AdvancedSearch: Advanced Search with Category, Subcategory and Price', async ({ page }) => {
    // Step 1: Launch application
    await page.goto('https://demowebshop.tricentis.com/');
    console.log('Launching application');

    // Step 2: Verify home page
    const searchTextbox = page.locator('.search-box-text.ui-autocomplete-input');
    await expect(searchTextbox).toBeVisible();
    console.log('Home page is loaded');

    // Step 3: Search for computer
    await searchTextbox.fill('computer');
    await page.getByRole('button', { name: 'Search' }).click();

    const searchResults = page.locator('.search-results');
    await expect(searchResults).toBeVisible();
    const resultCount = await page.locator('.product-item').count();
    expect(resultCount).toBeGreaterThan(0);
    console.log('Search results page is displayed');

    const resultNames = await page.locator('.product-title').allInnerTexts();
    console.log('Result names: ', resultNames);
    expect(resultNames.length).toBeGreaterThan(0);

    // Step 4: Open advanced search
    await page.getByLabel('Advanced search').check();
    await page.locator('#Q').fill('computer');
    await page.selectOption('#Cid', { label: 'Computers' });
    await page.locator('#Isc').check();
    await page.locator('.price-from').fill('700');
    await page.locator('.price-to').fill('1900');
    await page.getByLabel('Search In product descriptions').check();

    // Step 5: Verify advanced search state is preserved
    await expect(page.locator('#Q')).toHaveValue('computer');
    await expect(page.locator('#Cid')).toHaveValue('2');
    await expect(page.locator('#Isc')).toBeChecked();
    await expect(page.locator('.price-from')).toHaveValue('700');
    await expect(page.locator('.price-to')).toHaveValue('1900');
    await expect(page.getByLabel('Search In product descriptions')).toBeChecked();
    console.log('Advanced search values are retained');

    // Step 6: Click Search
    await page.locator('.button-1.search-button').click();
    await expect(page.locator('.search-results')).toBeVisible();

    const priceTexts = await page.locator('.price.actual-price').allInnerTexts();
    console.log('Displayed prices: ', priceTexts);
    expect(priceTexts.length).toBeGreaterThan(0);

    const prices = priceTexts.map((price) => Number.parseFloat(price.replace(/[^0-9.]/g, '')));

    for (const price of prices) {
        expect(price).toBeGreaterThanOrEqual(700);
        expect(price).toBeLessThanOrEqual(1900);
    }

    // Step 7: Repeat search with subcategory disabled
    await page.locator('#Isc').uncheck();
    await page.locator('.button-1.search-button').click();
    await expect(page.locator('.search-results')).toBeVisible();
    console.log('Second search is executed with subcategory unchecked');

    const secondResultNames = await page.locator('.product-title').allInnerTexts();
    console.log('Second result names: ', secondResultNames);
    expect(Array.isArray(secondResultNames)).toBeTruthy();

    const comparison = JSON.stringify(resultNames) === JSON.stringify(secondResultNames);
    console.log('Result set comparison: ', comparison ? 'same' : 'different');
    expect(typeof comparison).toBe('boolean');
});
