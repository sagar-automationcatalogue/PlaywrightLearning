import { expect, test } from '@playwright/test';

test('TC_02_BooksCategory: Sorting, Price filtering and price options', async ({ page }) => {
    // Step 1: Launch browser and open Demo Web Shop.
    console.log('Launching Demo Web Shop');
    await page.goto('https://demowebshop.tricentis.com/');

    // Step 2: Verify the home page is loaded.
    await expect(page.getByRole('heading', { name: 'Welcome to our store' })).toBeVisible();
    console.log('Home page is loaded');

    // Step 3: Navigate to the Books category.
    await page.getByRole('link', { name: 'Books', exact: true }).first().click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/books');
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
    console.log('Books page is displayed');

    // Step 4: Apply the price filter 25.00 - 50.00.
    await page.getByRole('link', { name: '25.00 - 50.00', exact: true }).click();
    await expect(page).toHaveURL(/price=25-50/);
    await expect(page.getByRole('link', { name: 'Remove Filter', exact: true })).toBeVisible();

    const filteredProductCount = await page.locator('.product-item').count();
    expect(filteredProductCount).toBe(0);
    console.log('Filtered result is empty for 25.00 - 50.00');

    // Step 5: Remove the filter to restore the product list.
    await page.getByRole('link', { name: 'Remove Filter', exact: true }).click();
    await expect(page).not.toHaveURL(/price=25-50/);

    const productCount = await page.locator('.product-item').count();
    expect(productCount).toBeGreaterThan(0);
    await expect(page.locator('.product-item').first()).toBeVisible();
    console.log('Filter removed and products are visible again');

    // Step 6: Sort by Name: A to Z.
    const sortDropdown = page.locator('select').nth(1);
    await sortDropdown.selectOption({ label: 'Name: A to Z' });
    await expect(page.locator('.product-title').first()).toBeVisible();

    const productNames = await page.locator('.product-title').allInnerTexts();
    expect(productNames.length).toBeGreaterThan(0);

    const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
    expect(productNames).toEqual(sortedNames);
    console.log('Products are sorted by name A to Z');

    // Step 7: Sort by Price: Low to High.
    await sortDropdown.selectOption({ label: 'Price: Low to High' });
    await expect(page.locator('.actual-price').first()).toBeVisible();

    const priceTexts = await page.locator('.actual-price').allInnerTexts();
    const prices = priceTexts.map((price) => Number.parseFloat(price.replace(/[^0-9.]/g, '')));
    expect(prices.length).toBeGreaterThan(0);

    for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
    console.log('Products are sorted by price low to high');

    // Step 8: Change view to List.
    const viewDropdown = page.locator('select').nth(0);
    await viewDropdown.selectOption({ label: 'List' });
    await expect(viewDropdown).not.toHaveValue('');
    console.log('List view is selected');

    // Step 9: Change view to Grid.
    await viewDropdown.selectOption({ label: 'Grid' });
    await expect(viewDropdown).not.toHaveValue('');
    console.log('Grid view is selected');
});
