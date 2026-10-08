import { expect, test } from '@playwright/test';
import { TC_05_ConfigureApparelProduct } from '../../../test-data/demoWebShop.ts';

test('@regression TC_05_ConfigureApparelProduct: Add sneaker to wishlist and cart', async ({ page }) => {
    // Step 1: Log in with the existing user.
    console.log('Opening Demo Web Shop and logging in');
    await page.goto('https://demowebshop.tricentis.com/');
    await page.getByRole('link', { name: 'Log in', exact: true }).click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/login');
    await page.getByRole('textbox', { name: 'Email:' }).fill(TC_05_ConfigureApparelProduct.email);
    await page.getByRole('textbox', { name: 'Password:' }).fill(TC_05_ConfigureApparelProduct.password);
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page.getByRole('link', { name: TC_05_ConfigureApparelProduct.email, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out', exact: true })).toBeVisible();
    console.log('User is authenticated');

    // Prepare repeatable test data by removing only this sneaker from the Wishlist and cart.
    console.log('Removing any previous Blue and green Sneaker entries');
    await page.goto('https://demowebshop.tricentis.com/wishlist');
    const oldWishlistSneakerRows = page.locator('.cart-item-row').filter({
        hasText: TC_05_ConfigureApparelProduct.productName
    });
    const oldWishlistSneakerCount = await oldWishlistSneakerRows.count();

    for (let index = 0; index < oldWishlistSneakerCount; index++) {
        await oldWishlistSneakerRows.nth(index).locator('input[name="removefromcart"]').check();
    }

    if (oldWishlistSneakerCount > 0) {
        await page.getByRole('button', { name: 'Update wishlist', exact: true }).click();
        await expect(page.locator('.cart-item-row').filter({
            hasText: TC_05_ConfigureApparelProduct.productName
        })).toHaveCount(0);
    }

    await page.goto('https://demowebshop.tricentis.com/cart');
    const oldCartSneakerRows = page.locator('.cart-item-row').filter({
        hasText: TC_05_ConfigureApparelProduct.productName
    });
    const oldCartSneakerCount = await oldCartSneakerRows.count();

    for (let index = 0; index < oldCartSneakerCount; index++) {
        await oldCartSneakerRows.nth(index).locator('input[name="removefromcart"]').check();
    }

    if (oldCartSneakerCount > 0) {
        await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
        await expect(page.locator('.cart-item-row').filter({
            hasText: TC_05_ConfigureApparelProduct.productName
        })).toHaveCount(0);
    }

    const startingWishlistCount = Number.parseInt(
        (await page.locator('.wishlist-qty').innerText()).replace(/[^\d]/g, ''),
        10
    );
    const startingCartCount = Number.parseInt(
        (await page.locator('.cart-qty').innerText()).replace(/[^\d]/g, ''),
        10
    );
    expect(Number.isFinite(startingWishlistCount)).toBeTruthy();
    expect(Number.isFinite(startingCartCount)).toBeTruthy();

    // Steps 2-3: Navigate to Apparel & Shoes and verify its heading.
    await page.getByRole('link', { name: 'Apparel & Shoes', exact: true }).first().click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/apparel-shoes');
    await expect(page.getByRole('heading', { name: 'Apparel & Shoes', exact: true })).toBeVisible();
    console.log('Apparel & Shoes category page is displayed');

    // Steps 4-5: Find the sneaker and save its displayed catalog price.
    const sneakerProduct = page.locator('.product-item').filter({
        has: page.getByRole('link', { name: TC_05_ConfigureApparelProduct.productName, exact: true })
    });
    await expect(sneakerProduct).toBeVisible();
    const catalogPriceText = await sneakerProduct.locator('.price.actual-price').innerText();
    const catalogPrice = Number.parseFloat(catalogPriceText.replace(/[^0-9.]/g, ''));
    expect(Number.isFinite(catalogPrice)).toBeTruthy();
    console.log(`${TC_05_ConfigureApparelProduct.productName} catalog price: ${catalogPriceText}`);

    // Steps 6-8: Open the product page, verify its name and check its availability.
    await sneakerProduct.getByRole('link', { name: TC_05_ConfigureApparelProduct.productName, exact: true }).click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/blue-and-green-sneaker');
    await expect(page.getByRole('heading', { name: TC_05_ConfigureApparelProduct.productName, exact: true })).toBeVisible();

    const productAvailability = page.locator('.stock .value');
    await expect(productAvailability).toBeVisible();
    await expect(productAvailability).toContainText(TC_05_ConfigureApparelProduct.availability);
    console.log(`Product availability: ${await productAvailability.innerText()}`);

    // Steps 9-11: Select size 10 and the second color option, then set quantity to 2.
    const sizeDropdown = page.locator('select[id^="product_attribute_"]');
    await sizeDropdown.selectOption({ label: TC_05_ConfigureApparelProduct.size });
    await expect(sizeDropdown.locator('option:checked')).toHaveText(TC_05_ConfigureApparelProduct.size);

    const colorOptions = page.locator('.color-squares input[type="radio"]');
    const secondColorOption = page.locator('.color-squares label').nth(1);
    await secondColorOption.click();
    await expect(colorOptions.nth(1)).toBeChecked();
    await expect(secondColorOption.locator('[title]')).toHaveAttribute('title', TC_05_ConfigureApparelProduct.color);

    const productQuantity = page.getByRole('textbox', { name: 'Qty:' });
    await productQuantity.fill(TC_05_ConfigureApparelProduct.quantity);
    await expect(productQuantity).toHaveValue(TC_05_ConfigureApparelProduct.quantity);
    console.log(`Selected size ${TC_05_ConfigureApparelProduct.size}, the second color (${TC_05_ConfigureApparelProduct.color}), and quantity ${TC_05_ConfigureApparelProduct.quantity}`);

    // Steps 12-13: Add the configured sneaker to the Wishlist and verify its count increases.
    await page.getByRole('button', { name: 'Add to wishlist', exact: true }).click();
    await expect(page.getByText(TC_05_ConfigureApparelProduct.wishlistConfirmation, { exact: false })).toBeVisible();

    const wishlistCountAfterAdding = Number.parseInt(
        (await page.locator('.wishlist-qty').innerText()).replace(/[^\d]/g, ''),
        10
    );
    expect(wishlistCountAfterAdding).toBeGreaterThan(startingWishlistCount);
    console.log(`Wishlist count increased from ${startingWishlistCount} to ${wishlistCountAfterAdding}`);

    // Steps 14-16: Open the Wishlist and verify the product and its selected configuration.
    await page.getByRole('link', { name: /Wishlist \(\d+\)/ }).click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/wishlist');

    const wishlistSneakerRow = page.locator('.cart-item-row').filter({
        has: page.getByRole('link', { name: TC_05_ConfigureApparelProduct.productName, exact: true })
    });
    await expect(wishlistSneakerRow).toBeVisible();
    await expect(wishlistSneakerRow).toContainText(`Size: ${TC_05_ConfigureApparelProduct.size}`);
    await expect(wishlistSneakerRow).toContainText(`Color: ${TC_05_ConfigureApparelProduct.color}`);
    await expect(wishlistSneakerRow.locator('input[name^="itemquantity"]')).toHaveValue(TC_05_ConfigureApparelProduct.quantity);
    console.log(`Wishlist contains the sneaker with size ${TC_05_ConfigureApparelProduct.size}, ${TC_05_ConfigureApparelProduct.color} color, and quantity ${TC_05_ConfigureApparelProduct.quantity}`);

    // Steps 17-18: Select the Wishlist item for Add to Cart and add it.
    const addToCartCheckbox = wishlistSneakerRow.locator('input[name="addtocart"]');
    await addToCartCheckbox.check();
    await expect(addToCartCheckbox).toBeChecked();
    await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/cart');

    // Step 19: Verify the Shopping Cart count increases.
    const cartCountAfterAdding = Number.parseInt(
        (await page.locator('.cart-qty').innerText()).replace(/[^\d]/g, ''),
        10
    );
    expect(cartCountAfterAdding).toBeGreaterThan(startingCartCount);
    console.log(`Shopping Cart count increased from ${startingCartCount} to ${cartCountAfterAdding}`);

    // Steps 20-22: Open the cart and verify the sneaker and its quantity.
    await expect(page.getByRole('heading', { name: 'Shopping cart', exact: true })).toBeVisible();
    const cartSneakerRow = page.locator('.cart-item-row')
        .filter({ hasText: TC_05_ConfigureApparelProduct.productName })
        .filter({ hasText: `Size: ${TC_05_ConfigureApparelProduct.size}` })
        .filter({ hasText: `Color: ${TC_05_ConfigureApparelProduct.color}` });
    await expect(cartSneakerRow).toBeVisible();
    await expect(cartSneakerRow).toContainText(TC_05_ConfigureApparelProduct.productName);
    await expect(cartSneakerRow).toContainText(`Size: ${TC_05_ConfigureApparelProduct.size}`);
    await expect(cartSneakerRow).toContainText(`Color: ${TC_05_ConfigureApparelProduct.color}`);

    const cartQuantityField = cartSneakerRow.locator('input[name^="itemquantity"]');
    await expect(cartQuantityField).toHaveValue(TC_05_ConfigureApparelProduct.quantity);

    const cartUnitPriceText = await cartSneakerRow.locator('.product-unit-price').innerText();
    const cartUnitPrice = Number.parseFloat(cartUnitPriceText.replace(/[^0-9.]/g, ''));
    const cartQuantity = Number.parseInt(await cartQuantityField.inputValue(), 10);
    const expectedSubtotal = cartUnitPrice * cartQuantity;
    console.log(`Expected line subtotal: ${cartUnitPrice} x ${cartQuantity} = ${expectedSubtotal}`);

    // Steps 23-24: Calculate the expected subtotal and compare it with the UI subtotal.
    const cartSubtotalText = await cartSneakerRow.locator('.product-subtotal').innerText();
    const displayedSubtotal = Number.parseFloat(cartSubtotalText.replace(/[^0-9.]/g, ''));
    expect(cartUnitPrice).toBe(catalogPrice);
    expect(cartQuantity).toBe(Number(TC_05_ConfigureApparelProduct.quantity));
    expect(displayedSubtotal).toBe(expectedSubtotal);
    console.log(`Cart unit price: ${cartUnitPriceText}; expected and displayed subtotal: ${cartSubtotalText}`);

    // Steps 25-26: Remove the sneaker and verify it no longer exists in the cart.
    await cartSneakerRow.locator('input[name="removefromcart"]').check();
    await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
    await expect(page.locator('.cart-item-row').filter({
        hasText: TC_05_ConfigureApparelProduct.productName
    })).toHaveCount(0);
    console.log(`${TC_05_ConfigureApparelProduct.productName} was removed from the cart`);
});
