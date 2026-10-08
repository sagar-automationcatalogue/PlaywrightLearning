import { expect, test } from '@playwright/test';
import { TC_04_BuildCustomizedComputer } from '../../../test-data/demoWebShop.ts';

test('@regression TC_04_BuildCustomizedComputer: Configure a computer, verify cart prices and remove it', async ({ page }) => {
    // Step 1: Log in with the existing user.
    await page.goto('https://demowebshop.tricentis.com/');
    await page.getByRole('link', { name: 'Log in', exact: true }).click();
    await page.getByLabel('Email:', { exact: true }).fill(TC_04_BuildCustomizedComputer.email);
    await page.getByLabel('Password:', { exact: true }).fill(TC_04_BuildCustomizedComputer.password);
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page.getByRole('link', { name: TC_04_BuildCustomizedComputer.email, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out', exact: true })).toBeVisible();
    console.log('Step 1: Existing user is authenticated.');

    // Record the initial cart so cleanup can verify that existing items are preserved.
    await page.locator('#topcartlink').getByRole('link').click();
    await expect(page.getByRole('heading', { name: TC_04_BuildCustomizedComputer.shoppingCartHeading, exact: true })).toBeVisible();
    const cartRows = page.locator('.cart-item-row');
    const initialCartRows = await cartRows.allInnerTexts();
    const initialQuantities: string[] = [];
    for (const row of await cartRows.all()) {
        initialQuantities.push(await row.locator('.qty-input').inputValue());
    }
    const headerCartQuantity = page.locator('#topcartlink .cart-qty');
    const initialCartCountText = await headerCartQuantity.innerText();
    const initialCartCount = Number(initialCartCountText.replace(/[^0-9]/g, ''));
    expect(Number.isInteger(initialCartCount)).toBe(true);

    // Match the name and configuration rather than a fixed row index.
    const configuredComputerRow = cartRows.filter({
        has: page.getByRole('link', { name: TC_04_BuildCustomizedComputer.productName, exact: true })
    }).filter({ hasText: TC_04_BuildCustomizedComputer.processorCartText })
        .filter({ hasText: TC_04_BuildCustomizedComputer.ramCartText })
        .filter({ hasText: TC_04_BuildCustomizedComputer.hddCartText })
        .filter({ hasText: `Software: ${TC_04_BuildCustomizedComputer.imageViewer}` })
        .filter({ hasText: `Software: ${TC_04_BuildCustomizedComputer.officeSuite}` })
        .filter({ hasNotText: TC_04_BuildCustomizedComputer.otherOfficeSuite });
    // Adding an identical existing configuration would merge quantities.
    // Stop before changing the cart if that configuration is already present.
    await expect(configuredComputerRow, 'The test configuration must not already be in the cart').toHaveCount(0);
    console.log('Initial cart quantity:', initialCartCount);

    // Step 2: Navigate to Computers using the main navigation.
    await page.locator('.top-menu').getByRole('link', { name: 'Computers', exact: true }).click();
    await expect(page).toHaveURL(/\/computers$/);
    await expect(page.getByRole('heading', { name: 'Computers', exact: true })).toBeVisible();

    // Step 3: Verify all three computer subcategories are available.
    const subcategories = page.locator('.sub-category-grid');
    await expect(subcategories.getByRole('link', { name: 'Desktops', exact: true })).toBeVisible();
    await expect(subcategories.getByRole('link', { name: 'Notebooks', exact: true })).toBeVisible();
    await expect(subcategories.getByRole('link', { name: 'Accessories', exact: true })).toBeVisible();

    // Step 4: Open Desktops.
    await subcategories.getByRole('link', { name: 'Desktops', exact: true }).click();
    await expect(page).toHaveURL(/\/desktops$/);
    await expect(page.getByRole('heading', { name: 'Desktops', exact: true })).toBeVisible();

    // Step 5: Verify desktop products are displayed.
    const desktopProducts = page.locator('.product-grid .product-item');
    await expect(desktopProducts.first()).toBeVisible();
    expect(await desktopProducts.count()).toBeGreaterThan(0);
    console.log('Steps 2-5: Computers subcategories verified and desktop products displayed.');

    // Step 6: Locate the target computer by its product-title link.
    const catalogProduct = desktopProducts.filter({
        has: page.locator('.product-title').getByRole('link', { name: TC_04_BuildCustomizedComputer.productName, exact: true })
    });
    await expect(catalogProduct).toHaveCount(1);
    await expect(catalogProduct).toBeVisible();

    // Step 7: Capture the catalog/base displayed price.
    const basePriceText = await catalogProduct.locator('.actual-price').innerText();
    const basePrice = Number(basePriceText.replace(/[^0-9.]/g, ''));
    expect(Number.isFinite(basePrice)).toBe(true);
    expect(basePrice).toBe(TC_04_BuildCustomizedComputer.basePrice);
    console.log('Steps 6-7: Target computer found. Catalog base price:', basePrice);

    // Step 8: Open the configurable product details page.
    await catalogProduct.locator('.product-title').getByRole('link', { name: TC_04_BuildCustomizedComputer.productName, exact: true }).click();
    await expect(page.locator('.product-essential')).toBeVisible();
    await expect(page.locator('.attributes')).toBeVisible();

    // Step 9: Verify the product title.
    await expect(page.getByRole('heading', { name: TC_04_BuildCustomizedComputer.productName, exact: true })).toBeVisible();

    // Step 10: Verify availability and that configuration can be added to the cart.
    await expect(page.locator('.stock .value')).toHaveText(TC_04_BuildCustomizedComputer.stockStatus);
    const productDetails = page.locator('.product-essential');
    const addToCart = productDetails.getByRole('button', { name: 'Add to cart', exact: true });
    await expect(addToCart).toBeEnabled();
    console.log('Steps 8-10: Correct product details opened; computer is in stock.');

    // Step 11: Select Fast processor.
    const fastProcessor = page.getByRole('radio', { name: new RegExp(`^${TC_04_BuildCustomizedComputer.processorOption}\\s`) });
    await fastProcessor.check();
    await expect(fastProcessor).toBeChecked();

    // Step 12: Select 8 GB RAM (the application label is 8GB).
    const ram8GB = page.getByRole('radio', { name: new RegExp(`^${TC_04_BuildCustomizedComputer.ramOption}\\s`) });
    await ram8GB.check();
    await expect(ram8GB).toBeChecked();

    // Step 13: Select 400 GB HDD.
    const hdd400GB = page.getByRole('radio', { name: new RegExp(`^${TC_04_BuildCustomizedComputer.hddOption}\\s`) });
    await hdd400GB.check();
    await expect(hdd400GB).toBeChecked();

    // Step 14: Select Image Viewer software.
    const imageViewer = page.getByRole('checkbox', { name: new RegExp(`^${TC_04_BuildCustomizedComputer.imageViewer}\\s`) });
    await imageViewer.check();
    await expect(imageViewer).toBeChecked();

    // Step 15: Select Office Suite software.
    const officeSuite = page.getByRole('checkbox', { name: new RegExp(`^${TC_04_BuildCustomizedComputer.officeSuite}\\s`) });
    await officeSuite.check();
    await expect(officeSuite).toBeChecked();

    // Step 16: Ensure unwanted software is not selected.
    const otherOfficeSuite = page.getByRole('checkbox', { name: new RegExp(`^${TC_04_BuildCustomizedComputer.otherOfficeSuite}\\s`) });
    await otherOfficeSuite.uncheck();
    await expect(otherOfficeSuite).not.toBeChecked();
    await expect(page.locator('.attributes input[type="checkbox"]:checked')).toHaveCount(TC_04_BuildCustomizedComputer.selectedSoftwareCount);
    console.log('Steps 11-16: Fast processor, 8GB RAM, 400GB HDD, Image Viewer and Office Suite selected.');

    // Step 17: Read additions from the selected option labels and calculate the unit price.
    // Example label: Fast [+100.00]. Only the value inside [+...] is the addition.
    const selectedOptionLabels = [
        await page.locator('.attributes label').filter({ hasText: new RegExp(`^${TC_04_BuildCustomizedComputer.processorOption}\\s`) }).innerText(),
        await page.locator('.attributes label').filter({ hasText: new RegExp(`^${TC_04_BuildCustomizedComputer.ramOption}\\s`) }).innerText(),
        await page.locator('.attributes label').filter({ hasText: new RegExp(`^${TC_04_BuildCustomizedComputer.hddOption}\\s`) }).innerText(),
        await page.locator('.attributes label').filter({ hasText: new RegExp(`^${TC_04_BuildCustomizedComputer.imageViewer}\\s`) }).innerText(),
        await page.locator('.attributes label').filter({ hasText: new RegExp(`^${TC_04_BuildCustomizedComputer.officeSuite}\\s`) }).innerText()
    ];
    let expectedUnitPrice = basePrice;
    for (const optionLabel of selectedOptionLabels) {
        const additionMatch = optionLabel.match(/\[\+([\d,.]+)\]/);
        expect(additionMatch, 'Selected option should show a price addition').not.toBeNull();
        const optionAddition = Number(additionMatch![1].replace(/,/g, ''));
        expect(Number.isFinite(optionAddition)).toBe(true);
        expectedUnitPrice += optionAddition;
    }
    expect(expectedUnitPrice).toBe(TC_04_BuildCustomizedComputer.expectedUnitPrice);
    console.log('Step 17: Base price plus selected additions:', expectedUnitPrice);

    // Step 18: Set quantity to 2.
    const productQuantity = productDetails.getByLabel('Qty:', { exact: true });
    await productQuantity.fill(String(TC_04_BuildCustomizedComputer.requestedQuantity));
    await expect(productQuantity).toHaveValue(String(TC_04_BuildCustomizedComputer.requestedQuantity));

    // Cleanup in finally also runs when an assertion after adding the product fails.
    try {
        // Step 19: Add the configured computer to the cart.
        await addToCart.click();

        // Step 20: Verify the success notification.
        const notification = page.locator('#bar-notification');
        await expect(notification).toBeVisible();
        await expect(notification).toContainText(TC_04_BuildCustomizedComputer.addToCartConfirmation);
        console.log('Steps 18-20: Two configured computers successfully added to the cart.');

        // Step 21: Verify the header cart count increased by the requested quantity.
        await expect(headerCartQuantity).toHaveText(`(${initialCartCount + TC_04_BuildCustomizedComputer.requestedQuantity})`);

        // Step 22: Open Shopping Cart.
        await page.locator('#topcartlink').getByRole('link').click();
        await expect(page).toHaveURL(/\/cart$/);
        await expect(page.getByRole('heading', { name: TC_04_BuildCustomizedComputer.shoppingCartHeading, exact: true })).toBeVisible();

        // Step 23: Locate the configured row by product name and configuration.
        await expect(configuredComputerRow).toHaveCount(1);
        await expect(configuredComputerRow).toBeVisible();

        // Step 24: Verify all configuration attributes shown in the cart.
        const attributes = configuredComputerRow.locator('.attributes');
        await expect(attributes).toContainText(TC_04_BuildCustomizedComputer.processorCartText);
        await expect(attributes).toContainText(TC_04_BuildCustomizedComputer.ramCartText);
        await expect(attributes).toContainText(TC_04_BuildCustomizedComputer.hddCartText);
        await expect(attributes).toContainText(`Software: ${TC_04_BuildCustomizedComputer.imageViewer}`);
        await expect(attributes).toContainText(`Software: ${TC_04_BuildCustomizedComputer.officeSuite}`);
        await expect(attributes).not.toContainText(TC_04_BuildCustomizedComputer.otherOfficeSuite);
        console.log('Steps 21-24: Cart count and configured computer attributes verified.');

        // Step 25: Verify the cart quantity is 2.
        const cartQuantity = configuredComputerRow.locator('.qty-input');
        await expect(cartQuantity).toHaveValue(String(TC_04_BuildCustomizedComputer.requestedQuantity));
        const quantity = Number(await cartQuantity.inputValue());

        // Step 26: Read the displayed unit price.
        const unitPriceText = await configuredComputerRow.locator('.product-unit-price').innerText();
        console.log('Step 26: Displayed unit price:', unitPriceText);

        // Step 27: Read the displayed line subtotal.
        const subtotalText = await configuredComputerRow.locator('.product-subtotal').innerText();
        console.log('Step 27: Displayed subtotal:', subtotalText);

        // Step 28: Convert currency strings to numbers.
        const unitPrice = Number(unitPriceText.replace(/[^0-9.]/g, ''));
        const subtotal = Number(subtotalText.replace(/[^0-9.]/g, ''));
        expect(Number.isFinite(unitPrice)).toBe(true);
        expect(Number.isFinite(subtotal)).toBe(true);
        expect(unitPrice).toBe(expectedUnitPrice);

        // Step 29: Calculate the expected subtotal programmatically.
        const expectedSubtotal = unitPrice * quantity;
        expect(expectedSubtotal).toBe(expectedUnitPrice * TC_04_BuildCustomizedComputer.requestedQuantity);
        console.log('Steps 28-29: Expected subtotal =', unitPrice, 'x', quantity, '=', expectedSubtotal);

        // Step 30: Compare the calculated subtotal with the displayed subtotal.
        expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
        console.log('Step 30: UI subtotal matches the calculation.');
    } finally {
        // Step 31: Remove only the configured computer added by this test.
        await page.goto('https://demowebshop.tricentis.com/cart');
        await expect(page.getByRole('heading', { name: TC_04_BuildCustomizedComputer.shoppingCartHeading, exact: true })).toBeVisible();
        if (await configuredComputerRow.count() === 1) {
            await configuredComputerRow.getByRole('checkbox').check();
            await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
        }
        await expect(configuredComputerRow).toHaveCount(0);
        console.log('Step 31: Configured computer removed.');

        // Step 32: Verify the cart returns to its original state.
        await expect(headerCartQuantity).toHaveText(initialCartCountText);
        await expect(cartRows).toHaveCount(initialCartRows.length);
        expect(await cartRows.allInnerTexts()).toEqual(initialCartRows);
        const remainingQuantities: string[] = [];
        for (const row of await cartRows.all()) {
            remainingQuantities.push(await row.locator('.qty-input').inputValue());
        }
        expect(remainingQuantities).toEqual(initialQuantities);
        if (initialCartRows.length === 0) {
            await expect(page.getByText(TC_04_BuildCustomizedComputer.emptyCartMessage, { exact: true })).toBeVisible();
        }
        console.log('Step 32: Original cart state restored. Cleanup successful.');
    }
});
