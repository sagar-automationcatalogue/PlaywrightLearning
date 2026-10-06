import { expect, test } from '@playwright/test';

test('@regressionTC_04_ApparelShoes: Add sneaker to wishlist and cart', async ({ page }) => {
    const email = 'sagar.automationcatalogue8@gmail.com';

    // Step 1: Log in with the existing user.
    console.log('Opening Demo Web Shop and logging in');
    await page.goto('https://demowebshop.tricentis.com/');
    await page.getByRole('link', { name: 'Log in', exact: true }).click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/login');
    await page.getByRole('textbox', { name: 'Email:' }).fill(email);
    await page.getByRole('textbox', { name: 'Password:' }).fill('Admin@123');
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page.getByRole('link', { name: email, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out', exact: true })).toBeVisible();
    console.log('User is authenticated');

    // Prepare repeatable test data by removing only this sneaker from the Wishlist and cart.
    console.log('Removing any previous Blue and green Sneaker entries');
    await page.goto('https://demowebshop.tricentis.com/wishlist');
    const oldWishlistSneakerRows = page.locator('.cart-item-row').filter({
        hasText: 'Blue and green Sneaker'
    });
    const oldWishlistSneakerCount = await oldWishlistSneakerRows.count();

    for (let index = 0; index < oldWishlistSneakerCount; index++) {
        await oldWishlistSneakerRows.nth(index).locator('input[name="removefromcart"]').check();
    }

    if (oldWishlistSneakerCount > 0) {
        await page.getByRole('button', { name: 'Update wishlist', exact: true }).click();
        await expect(page.locator('.cart-item-row').filter({
            hasText: 'Blue and green Sneaker'
        })).toHaveCount(0);
    }

    await page.goto('https://demowebshop.tricentis.com/cart');
    const oldCartSneakerRows = page.locator('.cart-item-row').filter({
        hasText: 'Blue and green Sneaker'
    });
    const oldCartSneakerCount = await oldCartSneakerRows.count();

    for (let index = 0; index < oldCartSneakerCount; index++) {
        await oldCartSneakerRows.nth(index).locator('input[name="removefromcart"]').check();
    }

    if (oldCartSneakerCount > 0) {
        await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
        await expect(page.locator('.cart-item-row').filter({
            hasText: 'Blue and green Sneaker'
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
        has: page.getByRole('link', { name: 'Blue and green Sneaker', exact: true })
    });
    await expect(sneakerProduct).toBeVisible();
    const catalogPriceText = await sneakerProduct.locator('.price.actual-price').innerText();
    const catalogPrice = Number.parseFloat(catalogPriceText.replace(/[^0-9.]/g, ''));
    expect(Number.isFinite(catalogPrice)).toBeTruthy();
    console.log(`Blue and green Sneaker catalog price: ${catalogPriceText}`);

    // Steps 6-8: Open the product page, verify its name and check its availability.
    await sneakerProduct.getByRole('link', { name: 'Blue and green Sneaker', exact: true }).click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/blue-and-green-sneaker');
    await expect(page.getByRole('heading', { name: 'Blue and green Sneaker', exact: true })).toBeVisible();

    const productAvailability = page.locator('.stock .value');
    await expect(productAvailability).toBeVisible();
    await expect(productAvailability).toContainText('In stock');
    console.log(`Product availability: ${await productAvailability.innerText()}`);

    // Steps 9-11: Select size 10 and the second color option, then set quantity to 2.
    const sizeDropdown = page.locator('select[id^="product_attribute_"]');
    await sizeDropdown.selectOption({ label: '10' });
    await expect(sizeDropdown.locator('option:checked')).toHaveText('10');

    const colorOptions = page.locator('.color-squares input[type="radio"]');
    const secondColorOption = page.locator('.color-squares label').nth(1);
    await secondColorOption.click();
    await expect(colorOptions.nth(1)).toBeChecked();
    await expect(secondColorOption.locator('[title]')).toHaveAttribute('title', 'Black');

    const productQuantity = page.getByRole('textbox', { name: 'Qty:' });
    await productQuantity.fill('2');
    await expect(productQuantity).toHaveValue('2');
    console.log('Selected size 10, the second color (Black), and quantity 2');

    // Steps 12-13: Add the configured sneaker to the Wishlist and verify its count increases.
    await page.getByRole('button', { name: 'Add to wishlist', exact: true }).click();
    await expect(page.getByText('The product has been added to your wishlist', { exact: false })).toBeVisible();

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
        has: page.getByRole('link', { name: 'Blue and green Sneaker', exact: true })
    });
    await expect(wishlistSneakerRow).toBeVisible();
    await expect(wishlistSneakerRow).toContainText('Size: 10');
    await expect(wishlistSneakerRow).toContainText('Color: Black');
    await expect(wishlistSneakerRow.locator('input[name^="itemquantity"]')).toHaveValue('2');
    console.log('Wishlist contains the sneaker with size 10, Black color, and quantity 2');

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
        .filter({ hasText: 'Blue and green Sneaker' })
        .filter({ hasText: 'Size: 10' })
        .filter({ hasText: 'Color: Black' });
    await expect(cartSneakerRow).toBeVisible();
    await expect(cartSneakerRow).toContainText('Blue and green Sneaker');
    await expect(cartSneakerRow).toContainText('Size: 10');
    await expect(cartSneakerRow).toContainText('Color: Black');

    const cartQuantityField = cartSneakerRow.locator('input[name^="itemquantity"]');
    await expect(cartQuantityField).toHaveValue('2');

    const cartUnitPriceText = await cartSneakerRow.locator('.product-unit-price').innerText();
    const cartUnitPrice = Number.parseFloat(cartUnitPriceText.replace(/[^0-9.]/g, ''));
    const cartQuantity = Number.parseInt(await cartQuantityField.inputValue(), 10);
    const expectedSubtotal = cartUnitPrice * cartQuantity;
    console.log(`Expected line subtotal: ${cartUnitPrice} x ${cartQuantity} = ${expectedSubtotal}`);

    // Steps 23-24: Calculate the expected subtotal and compare it with the UI subtotal.
    const cartSubtotalText = await cartSneakerRow.locator('.product-subtotal').innerText();
    const displayedSubtotal = Number.parseFloat(cartSubtotalText.replace(/[^0-9.]/g, ''));
    expect(cartUnitPrice).toBe(catalogPrice);
    expect(cartQuantity).toBe(2);
    expect(displayedSubtotal).toBe(expectedSubtotal);
    console.log(`Cart unit price: ${cartUnitPriceText}; expected and displayed subtotal: ${cartSubtotalText}`);

    // Steps 25-26: Remove the sneaker and verify it no longer exists in the cart.
    await cartSneakerRow.locator('input[name="removefromcart"]').check();
    await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
    await expect(page.locator('.cart-item-row').filter({
        hasText: 'Blue and green Sneaker'
    })).toHaveCount(0);
    console.log('Blue and green Sneaker was removed from the cart');
});
