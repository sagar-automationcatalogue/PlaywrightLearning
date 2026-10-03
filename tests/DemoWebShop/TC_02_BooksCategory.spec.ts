import { expect, test } from '@playwright/test';

test('TC_02_BooksCategory: Verify sorting, price filtering, page size and view', async ({ page }) => {
    // Step 1: Open Demo Web Shop and verify the home page.
    console.log('Opening Demo Web Shop');
    await page.goto('https://demowebshop.tricentis.com/');
    await expect(page.getByRole('heading', { name: 'Welcome to our store' })).toBeVisible();
    console.log('Home page is displayed');

    // Steps 2-3: Open Books and verify the category heading.
    await page.getByRole('link', { name: 'Books', exact: true }).first().click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/books');
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
    console.log('Books category page is displayed');

    // Steps 4-5: Capture the product names and verify that products are displayed.
    const initialProductNames = await page.locator('.product-title').allInnerTexts();
    expect(initialProductNames.length).toBeGreaterThan(0);
    console.log('Products currently displayed:', initialProductNames);

    // Steps 6-10: Sort product names from A to Z and compare with a sorted copy.
    const sortDropdown = page.locator('#products-orderby');
    await sortDropdown.selectOption({ label: 'Name: A to Z' });
    await expect(page).toHaveURL(/orderby=5/);

    const sortedProductNames = await page.locator('.product-title').allInnerTexts();
    expect(sortedProductNames.length).toBeGreaterThan(0);
    console.log('Product names after sorting A to Z:', sortedProductNames);

    const expectedAlphabeticalNames = [...sortedProductNames].sort((firstName, secondName) =>
        firstName.localeCompare(secondName)
    );
    expect(sortedProductNames).toEqual(expectedAlphabeticalNames);
    console.log('Product names are in alphabetical order');

    // Steps 11-14: Sort by price and verify each price is no lower than the previous one.
    await sortDropdown.selectOption({ label: 'Price: Low to High' });
    await expect(page).toHaveURL(/orderby=10/);

    const priceTexts = await page.locator('.actual-price').allInnerTexts();
    expect(priceTexts.length).toBeGreaterThan(0);
    console.log('Product prices after sorting low to high:', priceTexts);

    const prices = priceTexts.map((priceText) =>
        Number.parseFloat(priceText.replace(/[^0-9.]/g, ''))
    );
    expect(prices.every((price) => Number.isFinite(price))).toBeTruthy();

    for (let index = 1; index < prices.length; index++) {
        expect(prices[index]).toBeGreaterThanOrEqual(prices[index - 1]);
    }
    console.log('Product prices are in ascending order');

    // Steps 18-21: Change the page size and view before filtering.
    const pageSizeDropdown = page.locator('#products-pagesize');
    const currentPageSize = (await pageSizeDropdown.locator('option:checked').textContent())?.trim();
    const availablePageSizes = await pageSizeDropdown.locator('option').allTextContents();
    const pageSizeToSelect = availablePageSizes.find(
        (pageSize) => pageSize.trim() !== currentPageSize
    )?.trim();

    if (!pageSizeToSelect) {
        throw new Error('No alternative page size is available to select.');
    }

    await pageSizeDropdown.selectOption({ label: pageSizeToSelect });
    await expect(page).toHaveURL(new RegExp(`pagesize=${pageSizeToSelect}`));
    await expect(pageSizeDropdown.locator('option:checked')).toHaveText(pageSizeToSelect);

    const selectedPageSize = Number(pageSizeToSelect);
    expect(Number.isFinite(selectedPageSize)).toBeTruthy();

    const productCountAfterPageSizeChange = await page.locator('.product-item').count();
    expect(productCountAfterPageSizeChange).toBeLessThanOrEqual(selectedPageSize);
    console.log(`Page size changed to ${selectedPageSize}; displayed products: ${productCountAfterPageSizeChange}`);

    const viewDropdown = page.locator('#products-viewmode');
    const currentView = (await viewDropdown.locator('option:checked').textContent())?.trim();
    const availableViews = await viewDropdown.locator('option').allTextContents();
    const viewToSelect = availableViews.find((view) => view.trim() !== currentView)?.trim();

    if (!viewToSelect) {
        throw new Error('No alternative product view is available to select.');
    }

    await viewDropdown.selectOption({ label: viewToSelect });
    await expect(page).toHaveURL(new RegExp(`viewmode=${viewToSelect.toLowerCase()}`));
    await expect(viewDropdown.locator('option:checked')).toHaveText(viewToSelect);

    const selectedViewLayout = viewToSelect.toLowerCase() === 'list' ? '.product-list' : '.product-grid';
    await expect(page.locator(selectedViewLayout)).toBeVisible();
    console.log(`Product view changed to ${viewToSelect}`);

    // Steps 15-17: Apply the price filter and verify any returned prices are in range.
    await page.getByRole('link', { name: '25.00 - 50.00', exact: true }).click();
    await expect(page).toHaveURL(/price=25-50/);
    await expect(page.getByRole('link', { name: 'Remove Filter', exact: true })).toBeVisible();

    const filteredPriceTexts = await page.locator('.actual-price').allInnerTexts();
    const filteredPrices = filteredPriceTexts.map((priceText) =>
        Number.parseFloat(priceText.replace(/[^0-9.]/g, ''))
    );
    const filteredProductCount = await page.locator('.product-item').count();
    expect(filteredPriceTexts.length).toBe(filteredProductCount);
    expect(filteredPrices.every((price) => Number.isFinite(price))).toBeTruthy();

    for (const price of filteredPrices) {
        expect(price).toBeGreaterThanOrEqual(25);
        expect(price).toBeLessThanOrEqual(50);
    }
    console.log(`Price filter returned ${filteredProductCount} products; all returned prices are within 25.00 - 50.00`);

    // Steps 22-23: Remove the filter and verify that the broader product list returns.
    await page.getByRole('link', { name: 'Remove Filter', exact: true }).click();
    await expect(page).not.toHaveURL(/price=25-50/);
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();

    const restoredProductNames = await page.locator('.product-title').allInnerTexts();
    expect(restoredProductNames.length).toBeGreaterThan(filteredProductCount);
    expect(restoredProductNames.length).toBeLessThanOrEqual(selectedPageSize);
    expect(restoredProductNames.some((productName) => initialProductNames.includes(productName))).toBeTruthy();
    await expect(page.locator(selectedViewLayout)).toBeVisible();
    console.log('Price filter removed; the broader Books listing and selected layout are restored');
});
