import { expect, test } from '@playwright/test';

const TC_02_AutomationExercise = {
  category:"top",
  jeanCategory:"jean"
}

/** Testcase developed by Brahmam - Completed */
test('@sanity TC_02_AutomationExercise: Search Products, Validate Results, Hover and Open Details', async ({ page }) => {
  // Prevent third-party advertisements from covering the product actions.
  await page.route(/googleads|googlesyndication|doubleclick|googletagservices|adservice\.google/, route => route.abort());

  // 1. Open the home page and navigate to the product catalog.
  await page.goto('https://www.automationexercise.com/');
  await expect(page).toHaveURL('https://www.automationexercise.com/');
  await expect(page.getByRole('link', { name: /Home$/ })).toBeVisible();
  await expect(page.locator('#slider')).toBeVisible();
  console.log('Home page is displayed.');

  await page.getByRole('link', { name: /Products$/ }).click();
  await expect(page).toHaveURL('https://www.automationexercise.com/products');
  await expect(page.getByRole('heading', { name: /^ALL PRODUCTS$/i })).toBeVisible();

  // CSS identifies cards because they do not have an accessible role/name.
  const productCards = page.locator('.features_items .product-image-wrapper');
  await expect(productCards.first()).toBeVisible();
  const baselineProductCount = await productCards.locator('visible=true').count();
  expect(baselineProductCount).toBeGreaterThan(0);
  console.log('Visible product cards before search:', baselineProductCount);

  // 2. Search for top. The search button has no accessible name, so use its ID.
  const searchInput = page.getByRole('textbox', { name: 'Search Product' });
  const searchButton = page.locator('#submit_search');
  await expect(searchInput).toBeVisible();
  await searchInput.fill(TC_02_AutomationExercise.category);
  await expect(searchInput).toHaveValue(TC_02_AutomationExercise.category);
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  await expect(page.getByRole('heading', { name: /^SEARCHED PRODUCTS$/i })).toBeVisible();
  await expect(productCards.first()).toBeVisible();

  // Read .productinfo only: hover overlays repeat the names and prices.
  const productNames = await productCards.locator('.productinfo p').allTextContents();
  expect(productNames.length).toBeGreaterThan(0);
  expect(productNames.length).toBeLessThanOrEqual(baselineProductCount);
  console.log('Search results for top:', productNames);

  const normalizedProductNames = productNames.map(name => name.trim().toLowerCase());
  for (let index = 0; index < normalizedProductNames.length; index++) {
    const productName = productNames[index].trim();
    const normalizedName = normalizedProductNames[index];

    // Search also matches categories: a shirt can belong to the Tops category.
    if (normalizedName.includes(TC_02_AutomationExercise.category)) {
      expect(normalizedName).toContain(TC_02_AutomationExercise.category);
      console.log('Relevant product name verified:', productName);
    } else {
      const relatedProductCard = productCards.filter({
        has: page.locator('.productinfo').getByText(productName, { exact: true }),
      });
      await expect(relatedProductCard).toHaveCount(1);
      await relatedProductCard.getByRole('link', { name: 'View Product' }).click();
      await expect(page).toHaveURL(/\/product_details\/\d+$/);
      const relatedProductDetails = page.locator('.product-information');
      await expect(relatedProductDetails.getByRole('heading', { name: productName, exact: true })).toBeVisible();
      await expect(relatedProductDetails.getByText(/^Category:/)).toContainText(/>\s*Tops\b/i);
      console.log('Top-related category verified for:', productName);
      await page.goBack();
      await expect(page.getByRole('heading', { name: /^SEARCHED PRODUCTS$/i })).toBeVisible();
      await expect(productCards).toHaveCount(productNames.length);
    }
  }

  // 3. Capture and validate one displayed price for every result.
  const productPrices = productCards.locator('.productinfo').getByRole('heading');
  await expect(productPrices).toHaveCount(productNames.length);
  const searchedPrices = await productPrices.allTextContents();
  console.log('Prices of searched products:', searchedPrices);
  for (const price of searchedPrices) {
    expect(price.trim()).toMatch(/^Rs\.\s*\d+(\.\d{1,2})?$/);
  }
  console.log('All searched product prices have a valid currency and numeric value.');

  // 4. Select a result by its exact name, rather than by a card position.
  const selectedProductName = productNames[0].trim();
  const selectedProductPrice = searchedPrices[0].trim();
  const selectedProductCard = productCards.filter({
    has: page.locator('.productinfo').getByText(selectedProductName, { exact: true }),
  });
  await expect(selectedProductCard).toHaveCount(1);
  await expect(selectedProductCard).toBeVisible();
  console.log('Selected product:', selectedProductName);

  await selectedProductCard.locator('.single-products').hover();
  const productOverlay = selectedProductCard.locator('.product-overlay');
  await expect(productOverlay).toBeVisible();
  // Add to cart is an <a> without href, so it has no link role.
  await expect(productOverlay.getByText(/Add to cart$/)).toBeVisible();
  console.log('Hover overlay and Add to cart action are visible.');

  const viewProductLink = selectedProductCard.getByRole('link', { name: 'View Product' });
  await viewProductLink.hover();
  await expect(viewProductLink).toBeVisible();
  await viewProductLink.click();
  await expect(page).toHaveURL(/\/product_details\/\d+$/);

  // 5. Verify the selected product and all required detail metadata.
  const productDetails = page.locator('.product-information');
  await expect(productDetails.getByRole('heading', { name: selectedProductName, exact: true })).toBeVisible();
  const category = productDetails.getByText(/^Category:/);
  await expect(category).toBeVisible();
  await expect(category).toHaveText(/^Category:\s*\S.+/);
  const detailPrice = productDetails.getByText(/^Rs\.\s*\d/);
  await expect(detailPrice).toBeVisible();
  await expect(detailPrice).toHaveText(selectedProductPrice);
  // Match each complete paragraph to include both its bold label and value.
  const availability = productDetails.getByRole('paragraph').filter({ hasText: /^Availability:/ });
  await expect(availability).toBeVisible();
  await expect(availability).toHaveText(/^Availability:\s*\S.+/);
  const condition = productDetails.getByRole('paragraph').filter({ hasText: /^Condition:/ });
  await expect(condition).toBeVisible();
  await expect(condition).toHaveText(/^Condition:\s*\S.+/);
  const brand = productDetails.getByRole('paragraph').filter({ hasText: /^Brand:/ });
  await expect(brand).toBeVisible();
  await expect(brand).toHaveText(/^Brand:\s*\S.+/);
  console.log('Product name, category, price, availability, condition and brand are verified.');

  // 6. Restore the catalog and use the same search controls for jean.
  await page.getByRole('link', { name: /Products$/ }).click();
  await expect(page).toHaveURL('https://www.automationexercise.com/products');
  await expect(page.getByRole('heading', { name: /^ALL PRODUCTS$/i })).toBeVisible();
  await expect(productCards).toHaveCount(baselineProductCount);
  console.log('Full product catalog is restored.');

  await expect(searchInput).toBeVisible();
  await searchInput.fill(TC_02_AutomationExercise.jeanCategory);
  await expect(searchInput).toHaveValue(TC_02_AutomationExercise.jeanCategory);
  await searchButton.click();
  await expect(page.getByRole('heading', { name: /^SEARCHED PRODUCTS$/i })).toBeVisible();
  await expect(productCards.first()).toBeVisible();
  const alternateProductNames = await productCards.locator('.productinfo p').allTextContents();
  expect(alternateProductNames.length).toBeGreaterThan(0);
  console.log('Search results for jean:', alternateProductNames);

  const normalizedAlternateNames = alternateProductNames.map(name => name.trim().toLowerCase());
  for (const productName of normalizedAlternateNames) {
    expect(productName).toContain(TC_02_AutomationExercise.jeanCategory);
    console.log('Jean-related product verified:', productName);
  }
  console.log('Both keyword searches completed successfully.');
});
