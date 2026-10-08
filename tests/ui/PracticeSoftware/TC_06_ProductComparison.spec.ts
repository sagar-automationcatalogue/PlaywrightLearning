import { expect, test } from '@playwright/test';
import { TC_06_ProductComparison } from '../../../test-data/practiceSoftware.ts';

test('@regressionTC_06_ProductComparison: Compare Three Products → Validate Matrix → Clear', async ({ page }) => {
    const toolshopUrl = 'https://practicesoftwaretesting.com/';
    await page.goto(toolshopUrl);
    await expect(page.getByRole('menubar', { name: 'Main menu' })).toBeVisible();
    await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);

    // Clear stale comparison entries when the application exposes them.
    const existingCompareLink = page.locator('a[href*="compare"]').filter({ hasText: /compare/i }).first();
    if (await existingCompareLink.count()) {
        await existingCompareLink.click();
        const removeButtons = page.getByRole('button', { name: /remove/i });
        while (await removeButtons.count()) await removeButtons.first().click();
        await page.goto(toolshopUrl);
    }

    await page.getByRole('textbox', { name: 'Search' }).fill(TC_06_ProductComparison.searchTerm);
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByRole('heading', {
        name: new RegExp(`searched for: ${TC_06_ProductComparison.searchTerm}`, 'i')
    })).toBeVisible();
    await expect.poll(async () => page.locator('a[href*="/product/"] h5').count()).toBeGreaterThan(0);
    const preferredNames = ['Combination Pliers', 'Pliers', 'Long Nose Pliers', 'Slip Joint Pliers'];
    const availableNames = (await page.locator('a[href*="/product/"] h5').allInnerTexts())
        .map(name => name.trim()).filter(name => preferredNames.includes(name));
    const targetNames = preferredNames.filter(name => availableNames.includes(name)).slice(0, 3);
    expect(targetNames).toHaveLength(3);
    for (const name of targetNames) {
        const card = page.locator('a[href*="/product/"]').filter({ has: page.getByRole('heading', { name, exact: true }) });
        await expect(card).toBeVisible();
        await card.getByRole('button', { name: 'Compare', exact: true }).click();
        await expect(page.getByRole('button', { name: /compare/i }).first()).toBeVisible();
    }

    const comparedNames = (await page.getByRole('heading').allInnerTexts()).map(name => name.trim());
    const compareDestination = page.getByRole('link', { name: 'Compare Now' });
    await expect(compareDestination).toBeVisible();
    await compareDestination.click();
    await expect(page).toHaveURL(/comparison/i);
    await expect(page.getByRole('heading', { name: 'Product Comparison', exact: true })).toBeVisible();

    for (const name of targetNames) await expect(page.getByRole('link', { name, exact: true }).first()).toBeVisible();

    const comparisonRows = page.getByRole('row');
    const priceRow = comparisonRows.filter({ hasText: /^Price/i });
    const brandRow = comparisonRows.filter({ hasText: /^Brand/i });
    const categoryRow = comparisonRows.filter({ hasText: /^Category/i });
    const stockRow = comparisonRows.filter({ hasText: /stock|availability/i });
    await expect(priceRow).toBeVisible();
    await expect(brandRow).toBeVisible();
    await expect(categoryRow).toBeVisible();
    await expect(stockRow).toBeVisible();
    const softExpect = expect.configure({ soft: true });
    for (const row of [priceRow, brandRow, categoryRow, stockRow]) {
        await softExpect(await row.locator('td').count()).toBeGreaterThan(1);
        await softExpect(row).not.toBeEmpty();
    }

    const specificationLabels = await comparisonRows.allInnerTexts();
    expect(specificationLabels.length).toBeGreaterThan(4);

    const removeOne = page.getByRole('button', { name: /remove/i }).first();
    if (await removeOne.count()) {
        await removeOne.click();
        await expect(page.getByRole('link', { name: targetNames[0], exact: true })).toHaveCount(0);
        await expect(page.getByRole('link', { name: targetNames[1], exact: true }).first()).toBeVisible();
        await expect(page.getByRole('link', { name: targetNames[2], exact: true }).first()).toBeVisible();
    }

    const clearAll = page.getByRole('button', { name: /clear|remove all/i });
    if (await clearAll.count()) await clearAll.first().click();
    else {
        const remainingRemovals = page.getByRole('button', { name: /remove/i });
        while (await remainingRemovals.count()) await remainingRemovals.first().click();
    }
    await expect(page.getByRole('table', { name: 'Product Comparison' }).getByRole('link')).toHaveCount(0);
    expect(comparedNames).toContain('Combination Pliers');
});
