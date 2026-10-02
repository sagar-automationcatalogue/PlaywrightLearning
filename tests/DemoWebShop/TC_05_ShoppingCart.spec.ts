import { test, expect } from '@playwright/test';

test('TC_05_ShoppingCart: Apparel & Shoes → Wishlist → Shopping Cart', async ({ page }) => {
  test.setTimeout(180_000);

  // Step 1: Launch application and log in
  console.log('Launching application and logging in');
  await page.goto('https://demowebshop.tricentis.com/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill('sagar.automationcatalogue8@gmail.com');
  await page.getByRole('textbox', { name: 'Password:' }).fill('Admin@123');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();

  // Step 2: Clear stale cart and wishlist data before starting the flow
  await page.goto('https://demowebshop.tricentis.com/cart');
  const cartRemoveInputs = page.locator('input[name="removefromcart"]');
  if (await cartRemoveInputs.count()) {
    const cartCount = await cartRemoveInputs.count();
    for (let i = 0; i < cartCount; i++) {
      await cartRemoveInputs.nth(i).check();
    }
    await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
  }

  await page.goto('https://demowebshop.tricentis.com/wishlist');
  const wishlistRemoveInputs = page.locator('input[name="removefromcart"]');
  if (await wishlistRemoveInputs.count()) {
    const wishlistCount = await wishlistRemoveInputs.count();
    for (let i = 0; i < wishlistCount; i++) {
      await wishlistRemoveInputs.nth(i).check();
    }
    await page.locator('input[name="updatecart"]').click();
  }

  // Step 3: Navigate to Apparel & Shoes
  await page.getByRole('link', { name: 'Apparel & Shoes' }).first().click();
  await expect(page.getByRole('heading', { name: 'Apparel & Shoes', exact: true })).toBeVisible();

  // Step 3: Open the product details page
  const sneakerCard = page.locator('.product-item').filter({ hasText: 'Blue and green Sneaker' }).first();
  await expect(sneakerCard).toBeVisible();
  const catalogPriceText = await sneakerCard.locator('.price').first().innerText();
  console.log(`Catalog price captured: ${catalogPriceText}`);

  await sneakerCard.getByRole('link', { name: 'Blue and green Sneaker', exact: true }).click();
  await expect(page.locator('.product-name')).toHaveText('Blue and green Sneaker');

  // Step 4: Verify product availability
  const availabilityText = await page.locator('.stock').innerText();
  console.log(`Product availability: ${availabilityText}`);
  expect(availabilityText).toContain('In stock');

  // Step 5: Select size 10 and second available color
  const sizeDropdown = page.locator('#product_attribute_28_7_10');
  await expect(sizeDropdown).toBeVisible();
  await sizeDropdown.selectOption({ label: '10' });
  await expect(sizeDropdown).toHaveValue('27');

  const secondColorLabel = page.locator('label[for="product_attribute_28_1_11_30"]');
  await expect(secondColorLabel).toBeVisible();
  await secondColorLabel.click();

  // Step 6: Set quantity to 2
  const quantityInput = page.locator('#addtocart_28_EnteredQuantity');
  await quantityInput.fill('2');
  await expect(quantityInput).toHaveValue('2');

  // Step 7: Add to wishlist and verify wishlist count
  await page.locator('#add-to-wishlist-button-28').click();
  await expect(page.getByText('The product has been added to your wishlist', { exact: false })).toBeVisible();
  console.log('Product is added to wishlist');

  await page.getByRole('link', { name: 'Wishlist' }).first().click();
  await expect(page).toHaveURL(/wishlist/);

  const wishlistRow = page.locator('tr').filter({ hasText: 'Blue and green Sneaker' }).filter({ hasText: 'Size: 10' }).filter({ hasText: 'Color: Black' }).first();
  await expect(wishlistRow).toBeVisible();
  console.log('Sneaker is visible in the wishlist with the chosen size and color');

  // Step 8: Add the wishlist item to cart
  await wishlistRow.locator('input[name="addtocart"]').check();
  await page.locator('input[value="Add to cart"]').click();
  await expect(page).toHaveURL(/cart/);
  console.log('Wishlist item is added to cart');

  // Step 9: Open shopping cart and verify product row
  await expect(page).toHaveURL(/cart/);

  const cartRow = page.locator('tr').filter({ hasText: 'Blue and green Sneaker' }).filter({ hasText: 'Size: 10' }).filter({ hasText: 'Color: Black' }).first();
  await expect(cartRow).toBeVisible();

  const cartText = (await cartRow.innerText()).replace(/\s+/g, ' ').trim();
  console.log(`Cart row text: ${cartText}`);

  const numbers = cartText.match(/\d+\.\d+/g) || [];
  const unitPrice = Number.parseFloat(numbers[0] || '0');
  const subtotal = Number.parseFloat(numbers[1] || '0');
  const quantity = 2;
  const expectedSubtotal = unitPrice * quantity;

  expect(unitPrice).toBeGreaterThan(0);
  expect(subtotal).toBe(expectedSubtotal);

  // Step 10: Remove the product from cart
  await cartRow.locator('input[name="removefromcart"]').check();
  await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
  await expect(page.getByText('Your Shopping Cart is empty!', { exact: false })).toBeVisible();
  console.log('Product is removed from cart');
});