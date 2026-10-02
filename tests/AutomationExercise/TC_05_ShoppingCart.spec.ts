import { expect, test } from '@playwright/test';

function priceToNumber(price: string): number {
    const amount = Number(price.replace(/[^\d.,]/g, '').replace(/,/g, ''));
    if (Number.isNaN(amount)) throw new Error(`Could not parse displayed price: ${price}`);
    return amount;
}

test('TC_05_ShoppingCart: Configure Apparel Product → Wishlist → Shopping Cart', async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto('https://demowebshop.tricentis.com/');
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.getByLabel('Email').fill('sagar.automationcatalogue8@gmail.com');
    await page.getByLabel('Password').fill('Admin@123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();

    await page.getByRole('link', { name: 'Apparel & Shoes' }).first().click();
    await expect(page).toHaveURL(/\/apparel-shoes/);
    await expect(page.getByRole('heading', { name: 'Apparel & Shoes' })).toBeVisible();

    const sneakerLink = page.getByRole('link', { name: 'Blue and green Sneaker', exact: true });
    await expect(sneakerLink).toBeVisible();
    const sneakerCard = page.locator('.product-item').filter({ has: sneakerLink });
    const catalogPriceText = (await sneakerCard.locator('.price').innerText()).trim();
    const catalogPrice = priceToNumber(catalogPriceText);
    console.log(`Blue and green Sneaker catalog price: ${catalogPriceText}`);
    await sneakerLink.click();

    const productDetails = page.locator('.product-essential');
    await expect(productDetails.getByRole('heading', { name: 'Blue and green Sneaker' })).toBeVisible();
    await expect(productDetails).toContainText(/in stock|available/i);

    const attributeSelects = productDetails.locator('select');
    const selectCount = await attributeSelects.count();
    let sizeSelectIndex = -1;
    for (let index = 0; index < selectCount; index++) {
        if (await attributeSelects.nth(index).locator('option').filter({ hasText: /^\s*10\s*$/ }).count()) {
            sizeSelectIndex = index;
            break;
        }
    }
    if (sizeSelectIndex < 0) throw new Error('Could not find the size selector with size 10.');
    const sizeSelect = attributeSelects.nth(sizeSelectIndex);
    const sizeOptions = await sizeSelect.locator('option').allTextContents();
    const sizeTen = sizeOptions.find(option => option.trim() === '10' || /\b10\b/.test(option));
    if (!sizeTen) throw new Error('Size 10 is not offered for Blue and green Sneaker.');
    await sizeSelect.selectOption({ label: sizeTen });

    // This product renders colors as radio buttons rather than a second select.
    const colorOptions = productDetails.getByRole('radio');
    expect(await colorOptions.count()).toBeGreaterThanOrEqual(2);
    const secondColor = colorOptions.nth(1);
    const selectedColor = (await secondColor.locator('xpath=ancestor::li[1]').innerText()).trim();
    const secondColorId = await secondColor.getAttribute('id');
    if (!secondColorId) throw new Error('The second color option has no associated label.');
    await productDetails.locator(`label[for="${secondColorId}"]`).click();
    await expect(secondColor).toBeChecked();

    const quantityInput = productDetails.getByRole('textbox', { name: 'Qty:' });
    await quantityInput.fill('2');
    await expect(quantityInput).toHaveValue('2');

    const wishlistCount = page.locator('.wishlist-qty');
    const wishlistBefore = Number((await wishlistCount.innerText()).replace(/\D/g, '') || '0');
    await productDetails.getByRole('button', { name: /add to wishlist/i }).click();
    await expect(page.locator('#bar-notification')).toContainText(/wishlist/i);
    await expect.poll(async () => Number((await wishlistCount.innerText()).replace(/\D/g, '') || '0'))
        .toBe(wishlistBefore + 2);

    await page.getByRole('link', { name: /wishlist/i }).first().click();
    await expect(page).toHaveURL(/\/wishlist/);
    const wishlistRow = page.locator('.cart-item-row').filter({ hasText: 'Blue and green Sneaker' });
    await expect(wishlistRow).toBeVisible();
    await expect(wishlistRow).toContainText('10');
    await expect(wishlistRow).toContainText(selectedColor);
    const wishlistQuantity = wishlistRow.locator('input.qty-input');
    if (await wishlistQuantity.inputValue() !== '2') {
        await wishlistQuantity.fill('2');
        await page.getByRole('button', { name: /update wishlist/i }).click();
    }
    await expect(wishlistQuantity).toHaveValue('2');

    await wishlistRow.locator('input[name="addtocart"]').check();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await expect(page).toHaveURL(/\/cart/);
    const cartCount = page.locator('.cart-qty');
    await expect.poll(async () => Number((await cartCount.innerText()).replace(/\D/g, '') || '0'))
        .toBeGreaterThan(0);

    const cartRow = page.locator('.cart-item-row').filter({ hasText: 'Blue and green Sneaker' });
    await expect(cartRow).toBeVisible();
    await expect(cartRow.locator('input.qty-input')).toHaveValue('2');
    const unitPriceText = (await cartRow.locator('.product-unit-price').innerText()).trim();
    const subtotalText = (await cartRow.locator('.product-subtotal').innerText()).trim();
    expect(priceToNumber(subtotalText)).toBeCloseTo(priceToNumber(unitPriceText) * 2, 2);
    expect(priceToNumber(unitPriceText)).toBeCloseTo(catalogPrice, 2);

    await cartRow.locator('input[name="removefromcart"]').check();
    await page.getByRole('button', { name: /update shopping cart/i }).click();
    await expect(page.locator('.cart-item-row').filter({ hasText: 'Blue and green Sneaker' })).toHaveCount(0);
});
