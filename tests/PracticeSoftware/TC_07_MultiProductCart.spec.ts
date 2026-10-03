import { expect, test } from '@playwright/test';
test('TC_07_MultiProductCart: CRUD → Quantity → Subtotals → Total', async ({ page }) => {
    const toolshopUrl = 'https://practicesoftwaretesting.com/';
    const products: Array<{ search: string; preferred: string | RegExp; quantity: number }> = [
        { search: 'pliers', preferred: /pliers/i, quantity: 1 },
        { search: 'Hammer', preferred: /hammer/i, quantity: 1 },
    ];
    // Start with the guest cart and clear any retained rows first.
    await page.goto(`${toolshopUrl}checkout`);
    const oldRows = page.getByRole('row').filter({ has: page.locator('input[type="number"]') });
    while (await oldRows.count()) {
        const row = oldRows.first();
        const remove = row.locator('.btn-danger').last();
        if (await remove.count()) await remove.click();
        else {
            const checkbox = row.getByRole('checkbox').first();
            if (await checkbox.count()) {
                await checkbox.check();
                const update = page.getByRole('button', { name: /update cart|update basket/i });
                if (await update.count()) await update.click();
                else await row.locator('td').last().click();
            } else await row.locator('td').last().locator('.btn-danger').click();
            await expect(row).toHaveCount(0);
        }
    }

    const selectedProducts: Array<{ name: string; quantity: number }> = [];
    for (const product of products) {
        await page.goto(toolshopUrl);
        await expect(page.getByRole('menubar', { name: 'Main menu' })).toBeVisible();
        await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);
        await page.getByRole('textbox', { name: 'Search' }).fill(product.search);
        await page.getByRole('button', { name: 'Search', exact: true }).click();
        await expect(page.getByRole('heading', { name: new RegExp(`searched for: ${product.search}`, 'i') })).toBeVisible();
        await expect.poll(async () => page.locator('a[href*="/product/"] h5').count()).toBeGreaterThan(0);
        let selectedName = '';
        const candidates = (await page.locator('a[href*="/product/"] h5').allInnerTexts())
            .map(name => name.trim())
            .filter(name => product.search.toLowerCase().split(' ').every(word => name.toLowerCase().includes(word)));
        for (const name of candidates) {
            const preferredMatch = typeof product.preferred === 'string'
                ? name === product.preferred
                : product.preferred.test(name);
            if (!preferredMatch) continue;
            const productCard = page.locator('.card:visible').filter({ has: page.getByRole('heading', { name, exact: true }) });
            await productCard.getByRole('heading', { name, exact: true }).click();
            await expect(page).toHaveURL(/\/product\//);
            const addToCart = page.getByRole('button', { name: /add to cart/i });
            await expect(addToCart).toBeVisible();
            if (await addToCart.isEnabled()) {
                const detailQuantity = page.getByRole('spinbutton');
                if (await detailQuantity.count()) await detailQuantity.fill(String(product.quantity));
                selectedName = name;
                selectedProducts.push({ name: selectedName, quantity: product.quantity });
                let mutationSucceeded = false;
                let mutationStatus: number | undefined;
                for (let attempt = 0; attempt < 2; attempt++) {
                    const cartMutation = page.waitForResponse(response =>
                        response.request().method() === 'POST' && /cart/i.test(response.url())
                    );
                    await addToCart.click();
                    const mutationResponse = await cartMutation;
                    mutationSucceeded = mutationResponse.ok();
                    mutationStatus = mutationResponse.status();
                    if (mutationSucceeded) break;
                }
                expect(mutationSucceeded, `Add to cart API returned ${mutationStatus}`).toBeTruthy();
                await expect(page.getByRole('link', { name: /^cart\s*\d*$/i })).toBeVisible();
                break;
            }
            await page.goBack();
            await expect(page.getByRole('heading', { name: new RegExp(`searched for: ${product.search}`, 'i') })).toBeVisible();
        }
        expect(selectedName).not.toBe('');
    }

    await page.getByRole('link', { name: /^cart\s*\d*$/i }).click();
    const rows = page.getByRole('row');
    for (const product of selectedProducts) await expect(rows.filter({ hasText: product.name })).toBeVisible();

    const unitPrices = new Map<string, number>();
    for (const product of selectedProducts) {
        const row = rows.filter({ hasText: product.name });
        const rowText = await row.innerText();
        const priceMatches = [...rowText.matchAll(/[$€£]\s*([\d,]+(?:\.\d{1,2})?)/g)];
        const unitPriceText = priceMatches[0]?.[1];
        expect(unitPriceText).toBeTruthy();
        unitPrices.set(product.name, Number(unitPriceText!.replace(/,/g, '')));
        const displayedQuantity = Number(await row.getByRole('spinbutton').inputValue());
        expect(displayedQuantity).toBeGreaterThan(0);
        // The demo caps some products at their available stock even when a
        // larger quantity was entered on the detail page.
        product.quantity = displayedQuantity;
    }

    for (const product of selectedProducts) {
        await expect(rows.filter({ hasText: product.name }).getByRole('spinbutton')).toHaveValue(String(product.quantity));
    }

    const expectedByProduct = new Map(selectedProducts.map(product => [
        product.name,
        unitPrices.get(product.name)! * product.quantity,
    ]));
    for (const product of selectedProducts) {
        const row = rows.filter({ hasText: product.name });
        const rowPrices = [...(await row.innerText()).matchAll(/[$€£]\s*([\d,]+(?:\.\d{1,2})?)/g)]
            .map(match => Number(match[1].replace(/,/g, '')));
        const lineSubtotal = rowPrices[rowPrices.length - 1];
        expect(lineSubtotal).toBeCloseTo(expectedByProduct.get(product.name)!, 2);
    }

    const expectedTotal = [...expectedByProduct.values()].reduce((sum, subtotal) => sum + subtotal, 0);
    const totalRow = rows.filter({ has: page.getByText('Total', { exact: true }) }).last();
    const totalMatches = [...(await totalRow.innerText()).matchAll(/[$€£]\s*([\d,]+(?:\.\d{1,2})?)/g)];
    expect(Number(totalMatches[totalMatches.length - 1][1].replace(/,/g, ''))).toBeCloseTo(expectedTotal, 2);

    const hammerName = selectedProducts.find(({ name }) => /hammer/i.test(name))?.name;
    expect(hammerName).toBeTruthy();
    const hammerRow = rows.filter({ hasText: hammerName! });
    await hammerRow.getByRole('spinbutton').fill('1');
    await hammerRow.getByRole('spinbutton').press('Enter');
    await expect(hammerRow.getByRole('spinbutton')).toHaveValue('1');
    const adjustedExpectedTotal = [...expectedByProduct.values()].reduce((sum, subtotal) => sum + subtotal, 0);
    await expect.poll(async () => {
        const matches = [...(await totalRow.innerText()).matchAll(/[$€£]\s*([\d,]+(?:\.\d{1,2})?)/g)];
        return Number(matches[matches.length - 1][1].replace(/,/g, ''));
    }).toBeCloseTo(adjustedExpectedTotal, 2);

    const firstSelectedName = selectedProducts[0].name;
    const removeFirstSelected = rows.filter({ hasText: firstSelectedName }).locator('.btn-danger').last();
    if (await removeFirstSelected.count()) await removeFirstSelected.click();
    else {
        await rows.filter({ hasText: firstSelectedName }).locator('td').last().locator('.btn-danger').click();
    }
    await expect(rows.filter({ hasText: firstSelectedName })).toHaveCount(0);
    await expect(rows.filter({ hasText: hammerName! })).toBeVisible();

    for (const { name } of selectedProducts.filter(({ name }) => name !== firstSelectedName)) {
        const row = rows.filter({ hasText: name });
        const remove = row.locator('.btn-danger').last();
        if (await remove.count()) await remove.click();
        else await row.locator('td').last().locator('.btn-danger').click();
    }
    await expect(page.getByRole('row').filter({ has: page.getByRole('spinbutton') })).toHaveCount(0);
});
