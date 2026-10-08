import { expect, test } from '@playwright/test';
import { TC_03_AdvancedSearch } from '../../../test-data/demoWebShop.ts';

test('@regression TC_03_AdvancedSearch: Advanced Search with Category, Subcategory and Price', async ({ page }) => {
    // Step 1: Open Demo Web Shop and verify the home page.
    await page.goto('https://demowebshop.tricentis.com/');
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/');
    await expect(page.getByRole('heading', { name: 'Welcome to our store', exact: true })).toBeVisible();
    console.log('Step 1: Demo Web Shop home page loaded.');

    // Step 2: Locate the store search textbox.
    // The store textbox has no accessible name, so locate it inside the search box.
    const storeSearch = page.locator('.search-box').getByRole('textbox');
    await expect(storeSearch).toBeVisible();

    // Step 3: Enter computer and submit the store search.
    await storeSearch.fill(TC_03_AdvancedSearch.keyword);
    await expect(storeSearch).toHaveValue(TC_03_AdvancedSearch.keyword);
    await page.locator('.search-box').getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/search\\?q=${TC_03_AdvancedSearch.keyword}`, 'i'));

    // Step 4: Verify the Search Results page is displayed.
    await expect(page.getByRole('heading', { name: 'Search', exact: true })).toBeVisible();
    const searchResults = page.locator('.search-results');
    await expect(searchResults).toBeVisible();
    console.log('Steps 2-4: Store search completed and the Search page is displayed.');

    // Step 5: Verify one or more results are displayed.
    const products = searchResults.locator('.product-item');
    await expect(products.first()).toBeVisible();
    const basicResultCount = await products.count();
    expect(basicResultCount).toBeGreaterThan(0);

    // Step 6: Read all displayed result product names.
    const basicResultNames = await products.locator('.product-title').allInnerTexts();
    expect(basicResultNames).toHaveLength(basicResultCount);
    console.log('Steps 5-6: Basic search result count:', basicResultCount);
    console.log('Basic search product names:', basicResultNames);

    // Step 7: Verify at least one product name relates to computer.
    let hasComputerResult = false;
    for (const productName of basicResultNames) {
        if (productName.toLowerCase().includes(TC_03_AdvancedSearch.keyword)) {
            hasComputerResult = true;
        }
    }
    expect(hasComputerResult).toBe(true);

    // Step 8: Navigate to the dedicated Search page.
    await page.goto('https://demowebshop.tricentis.com/search');
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/search');
    await expect(page.getByRole('heading', { name: 'Search', exact: true })).toBeVisible();

    // Step 9: Enable Advanced search and verify its controls are visible.
    const advancedSearch = page.getByLabel('Advanced search', { exact: true });
    await advancedSearch.check();
    await expect(advancedSearch).toBeChecked();
    await expect(page.locator('#advanced-search-block')).toBeVisible();
    console.log('Steps 7-9: Search relevance verified and advanced search opened.');

    // Step 10: Enter computer as the keyword.
    const keyword = page.getByLabel('Search keyword:', { exact: true });
    await keyword.fill(TC_03_AdvancedSearch.keyword);
    await expect(keyword).toHaveValue(TC_03_AdvancedSearch.keyword);

    // Step 11: Select Computers as the category.
    const category = page.getByLabel('Category:', { exact: true });
    await category.selectOption({ label: TC_03_AdvancedSearch.category });
    await expect(category.locator('option:checked')).toHaveText(TC_03_AdvancedSearch.category);

    // Step 12: Enable Automatically search sub categories.
    const subcategories = page.getByLabel('Automatically search sub categories', { exact: true });
    await subcategories.check();
    await expect(subcategories).toBeChecked();

    // Step 13: Enter 700 in From price (this field has no associated label).
    const fromPrice = page.locator('#Pf');
    await fromPrice.fill(TC_03_AdvancedSearch.minPrice);
    await expect(fromPrice).toHaveValue(TC_03_AdvancedSearch.minPrice);

    // Step 14: Enter 1900 in To price (this field has no associated label).
    const toPrice = page.locator('#Pt');
    await toPrice.fill(TC_03_AdvancedSearch.maxPrice);
    await expect(toPrice).toHaveValue(TC_03_AdvancedSearch.maxPrice);

    // Step 15: Enable Search in product descriptions.
    const descriptions = page.getByLabel('Search In product descriptions', { exact: true });
    await descriptions.check();
    await expect(descriptions).toBeChecked();
    console.log(`Steps 10-15: Keyword ${TC_03_AdvancedSearch.keyword}, category ${TC_03_AdvancedSearch.category}, price ${TC_03_AdvancedSearch.minPrice}-${TC_03_AdvancedSearch.maxPrice},`);
    console.log('subcategory search and description search are selected.');

    // Step 16: Click the Search button in the search form.
    const searchButton = page.locator('.search-input').getByRole('button', { name: 'Search', exact: true });
    await searchButton.click();
    await expect(page).toHaveURL(/\/search\?/);
    expect(new URL(page.url()).searchParams.get('Isc')).toBe(TC_03_AdvancedSearch.subcategorySearchEnabled);

    // Step 17: Verify advanced search returns one or more products.
    await expect(searchResults).toBeVisible();
    await expect(products.first()).toBeVisible();
    const advancedResultCount = await products.count();
    expect(advancedResultCount).toBeGreaterThan(0);
    console.log('Steps 16-17: Advanced search product count:', advancedResultCount);

    // Step 18: Read every displayed result price.
    const priceTexts = await products.locator('.price.actual-price').allInnerTexts();
    expect(priceTexts).toHaveLength(advancedResultCount);
    console.log('Step 18: Displayed price text:', priceTexts);

    // Step 19: Remove currency symbols, commas and words such as From.
    // The store uses a dot as the decimal separator, for example 1,200.00.
    const prices: number[] = [];
    for (const priceText of priceTexts) {
        const numericText = priceText.replace(/[^0-9.]/g, '');
        expect(numericText).not.toBe('');
        const price = Number(numericText);
        expect(Number.isFinite(price)).toBe(true);
        prices.push(price);
    }
    console.log('Step 19: Numeric prices:', prices);

    // Step 20: Verify every displayed price is within the requested range, inclusive.
    for (const price of prices) {
        expect(price).toBeGreaterThanOrEqual(Number(TC_03_AdvancedSearch.minPrice));
        expect(price).toBeLessThanOrEqual(Number(TC_03_AdvancedSearch.maxPrice));
    }
    console.log('Step 20: All displayed prices are within the requested range.');

    // Step 21: Store the first advanced-search product-name result set.
    const firstAdvancedResultNames = await products.locator('.product-title').allInnerTexts();
    expect(firstAdvancedResultNames).toHaveLength(advancedResultCount);
    console.log('Step 21: Products with subcategory search:', firstAdvancedResultNames);

    // Step 22: Disable automatic subcategory search.
    await subcategories.uncheck();
    await expect(subcategories).not.toBeChecked();

    // Step 23: Execute the same search with subcategory search disabled.
    await searchButton.click();
    expect(new URL(page.url()).searchParams.get('Isc')).toBe(TC_03_AdvancedSearch.subcategorySearchDisabled);
    await expect(searchResults).toBeVisible();
    // The live store returns no matches for the parent category alone.
    await expect(searchResults.getByText(TC_03_AdvancedSearch.noProductsMessage, { exact: true })).toBeVisible();
    await expect(products).toHaveCount(0);
    const secondAdvancedResultNames = await products.locator('.product-title').allInnerTexts();
    console.log('Steps 22-23: Products without subcategory search:', secondAdvancedResultNames);

    // Step 24: Compare the two advanced-search sets, ignoring display order.
    const firstResultSet = [...firstAdvancedResultNames].sort();
    const secondResultSet = [...secondAdvancedResultNames].sort();
    expect(secondResultSet.length).toBeLessThanOrEqual(firstResultSet.length);
    for (const productName of secondResultSet) {
        expect(firstResultSet).toContain(productName);
    }
    expect(secondResultSet).not.toEqual(firstResultSet);
    console.log('Step 24: Result sets differ; disabling subcategories returns no matching products.');

    // Step 25: Verify all advanced-search controls preserve the chosen criteria.
    await expect(advancedSearch).toBeChecked();
    await expect(page.locator('#advanced-search-block')).toBeVisible();
    await expect(keyword).toHaveValue(TC_03_AdvancedSearch.keyword);
    await expect(category.locator('option:checked')).toHaveText(TC_03_AdvancedSearch.category);
    await expect(subcategories).not.toBeChecked();
    await expect(fromPrice).toHaveValue(TC_03_AdvancedSearch.minPrice);
    await expect(toPrice).toHaveValue(TC_03_AdvancedSearch.maxPrice);
    await expect(descriptions).toBeChecked();
    console.log('Step 25: All advanced-search criteria are preserved after the second search.');
});
