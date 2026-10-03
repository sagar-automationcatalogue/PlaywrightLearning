import { expect, test } from '@playwright/test';
const API_BASE = 'https://api.practicesoftwaretesting.com';

test('TC_12_ApiUiContract: Product Search API ↔ Catalog UI ↔ Details API', async ({ page, request }) => {
    const term = 'pliers';
    const apiResponse = await request.get(`${API_BASE}/products/search`, { params: { q: term } });
    expect(apiResponse.ok()).toBeTruthy();
    const apiPayload = await apiResponse.json() as {
        data?: Array<Record<string, unknown>>;
        items?: Array<Record<string, unknown>>;
        current_page?: number;
        per_page?: number;
        total?: number;
    };
    const apiProducts = apiPayload.data ?? apiPayload.items ?? [];
    expect(apiProducts.length).toBeGreaterThan(0);
    for (const product of apiProducts) {
        expect(String(product.name ?? '').toLowerCase()).toContain(term);
        expect(product.id).toBeTruthy();
        expect(product.price).toBeDefined();
        expect(product.category).toBeDefined();
    }
    expect(apiPayload.current_page ?? 1).toBeGreaterThan(0);
    expect(apiPayload.per_page ?? apiProducts.length).toBeGreaterThan(0);
    expect(apiPayload.total ?? apiProducts.length).toBeGreaterThanOrEqual(apiProducts.length);

    const selectedApiProduct = apiProducts.find(product => product.in_stock === true) ?? apiProducts[0];
    await page.goto('https://practicesoftwaretesting.com/');
    await expect(page.getByRole('menubar', { name: 'Main menu' })).toBeVisible();
    await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);
    await page.getByRole('textbox', { name: 'Search' }).fill(term);
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByRole('heading', { name: /searched for: pliers/i })).toBeVisible();
    await expect.poll(async () => page.locator('a[href*="/product/"] h5').count()).toBeGreaterThan(0);
    const uiNames = (await page.locator('a[href*="/product/"] h5').allInnerTexts())
        .map(name => name.trim())
        .filter(name => apiProducts.some(product => product.name === name));
    expect(uiNames.length).toBeGreaterThan(0);
    expect(uiNames.some(name => /pliers/i.test(name))).toBeTruthy();
    const overlap = uiNames.some(name => apiProducts.some(product => product.name === name));
    expect(overlap).toBeTruthy();

    const detailResponse = await request.get(`${API_BASE}/products/${selectedApiProduct.id}`);
    expect(detailResponse.ok()).toBeTruthy();
    const detail = await detailResponse.json() as Record<string, unknown>;
    expect(detail.id).toBe(selectedApiProduct.id);
    expect(detail.name).toBe(selectedApiProduct.name);
    expect(Number(detail.price)).toBe(Number(selectedApiProduct.price));
    expect(detail.category).toBeDefined();

    const matchingCard = page.locator('.card:visible').filter({ hasText: String(selectedApiProduct.name) }).first();
    if (await matchingCard.count()) {
        const cardText = await matchingCard.innerText();
        const priceMatches = [...cardText.matchAll(/[$€£]\s*([\d,]+(?:\.\d{1,2})?)/g)];
        const uiPrice = Number(priceMatches[priceMatches.length - 1][1].replace(/,/g, ''));
        expect(uiPrice).toBeCloseTo(Number(selectedApiProduct.price), 2);
    }
});
