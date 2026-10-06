import { expect, test } from '@playwright/test';

const TC_03_CategoryProducts={
  brandPolo:"Polo",
  brandHM:"H&M"
}

/** Testcase developed by Vijaya Durgi - Completed */
test('@regression TC_03_CategoryProducts:', async ({ page }) => {
  // Prevent advertisements from covering category and brand links.
  await page.route(/googleads|googlesyndication|doubleclick|googletagservices|adservice\.google/, route => route.abort());

  // Steps 1-3: Open Home and verify the category and brand sidebars.
  await page.goto('https://www.automationexercise.com/');
  await expect(page).toHaveURL('https://www.automationexercise.com/');
  const categories = page.locator('#accordian');
  const brands = page.locator('.brands_products');
  await expect(categories).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Category', exact: true })).toBeVisible();
  await expect(brands).toBeVisible();
  await expect(brands.getByRole('heading', { name: 'Brands', exact: true })).toBeVisible();
  await expect(categories.getByRole('link', { name: /Women$/i })).toBeVisible();
  await expect(categories.getByRole('link', { name: /\bMen$/i })).toBeVisible();
  await expect(categories.getByRole('link', { name: /Kids$/i })).toBeVisible();
  console.log('Home page, Women, Men, Kids and Brands are visible.');

  // Steps 4-5: Expand Women once and verify its subcategory links.
  await categories.getByRole('link', { name: /Women$/i }).click();
  const womenPanel = page.locator('#Women');
  await expect(womenPanel).toBeVisible();
  await expect(womenPanel.getByRole('link', { name: 'Dress', exact: true })).toBeVisible();
  await expect(womenPanel.getByRole('link', { name: 'Tops', exact: true })).toBeVisible();
  await expect(womenPanel.getByRole('link', { name: 'Saree', exact: true })).toBeVisible();
  console.log('Women subcategories Dress, Tops and Saree are visible.');

  // Steps 6-7: The panel is already open; click Tops without toggling Women again.
  await womenPanel.getByRole('link', { name: 'Tops', exact: true }).click();
  await expect(page).toHaveURL(/\/category_products\/\d+$/);
  await expect(page.getByRole('heading', { name: /^Women - Tops Products$/i })).toBeVisible();

  // Steps 8-10: Wait for products before collecting names and the current URL.
  // Read .productinfo only because the hidden overlays repeat the product names.
  const productNames = page.locator('.features_items .productinfo p');
  await expect(productNames.first()).toBeVisible();
  const womenProductNames = await productNames.allTextContents();
  expect(womenProductNames.length).toBeGreaterThan(0);
  const womenTopsUrl = page.url();
  console.log('Women Tops products:', womenProductNames);
  console.log('Women Tops URL:', womenTopsUrl);

  // Steps 11-14: Expand Men, select Jeans and verify the destination.
  await categories.getByRole('link', { name: /\bMen$/i }).click();
  const menPanel = page.locator('#Men');
  await expect(menPanel).toBeVisible();
  await expect(menPanel.getByRole('link', { name: 'Jeans', exact: true })).toBeVisible();
  await menPanel.getByRole('link', { name: 'Jeans', exact: true }).click();
  await expect(page).toHaveURL(/\/category_products\/\d+$/);
  await expect(page.getByRole('heading', { name: /^Men - Jeans Products$/i })).toBeVisible();
  const menJeansUrl = page.url();
  expect(menJeansUrl).not.toBe(womenTopsUrl);
  console.log('Men Jeans URL:', menJeansUrl);

  // Steps 15-16: Capture the displayed Jeans products.
  await expect(productNames.first()).toBeVisible();
  const menProductNames = await productNames.allTextContents();
  expect(menProductNames.length).toBeGreaterThan(0);
  console.log('Men Jeans products:', menProductNames);

  // Steps 17-20: Restore Products and read the brand labels and counts.
  await page.getByRole('banner').getByRole('link', { name: /Products$/ }).click();
  await expect(page).toHaveURL('https://www.automationexercise.com/products');
  await expect(page.getByRole('heading', { name: /^All Products$/i })).toBeVisible();
  await expect(brands).toBeVisible();
  const poloLink = brands.getByRole('link', { name: /Polo$/ });
  const hmLink = brands.getByRole('link', { name: /H&M$/ });
  await expect(poloLink).toBeVisible();
  await expect(hmLink).toBeVisible();
  const brandLabels = await brands.getByRole('link').allTextContents();
  console.log('Brand labels and counts:', brandLabels);
  // textContent reads the original label without CSS uppercase formatting.
  const poloLabel = ((await poloLink.textContent()) ?? '').replace(/\(\d+\)/, '').trim();
  const hmLabel = ((await hmLink.textContent()) ?? '').replace(/\(\d+\)/, '').trim();
  expect(poloLabel).toBe(TC_03_CategoryProducts.brandPolo);
  expect(hmLabel).toBe(TC_03_CategoryProducts.brandHM);
  console.log('Polo and H&M brands are verified.');

  // Steps 21-24: Select Polo and verify its heading and products.
  await poloLink.click();
  await expect(page).toHaveURL(/\/brand_products\/Polo$/);
  await expect(page.getByRole('heading', { name: /^Brand - Polo Products$/i })).toBeVisible();
  await expect(productNames.first()).toBeVisible();
  const poloProductNames = await productNames.allTextContents();
  expect(poloProductNames.length).toBeGreaterThan(0);
  const poloUrl = page.url();
  console.log('Polo products:', poloProductNames);

  // Steps 25-29: Select H&M once and verify the new heading, products and URL.
  await hmLink.click();
  await expect(page).toHaveURL(/\/brand_products\/H(%26|&)M$/);
  await expect(page.getByRole('heading', { name: /^Brand - H&M Products$/i })).toBeVisible();
  await expect(productNames.first()).toBeVisible();
  const hmProductNames = await productNames.allTextContents();
  expect(hmProductNames.length).toBeGreaterThan(0);
  expect(page.url()).not.toBe(poloUrl);
  console.log('H&M products:', hmProductNames);
  console.log('Brand URL changed from', poloUrl, 'to', page.url());

  // Steps 30-31: Restore Products and verify the sidebars are still usable.
  await page.getByRole('banner').getByRole('link', { name: /Products$/ }).click();
  await expect(page).toHaveURL('https://www.automationexercise.com/products');
  await expect(page.getByRole('heading', { name: /^All Products$/i })).toBeVisible();
  await expect(categories).toBeVisible();
  await expect(brands).toBeVisible();
  await categories.getByRole('link', { name: /Women$/i }).click();
  await expect(womenPanel.getByRole('link', { name: 'Tops', exact: true })).toBeVisible();
  await expect(poloLink).toBeVisible();
  await expect(poloLink).toBeEnabled();
  await expect(hmLink).toBeVisible();
  await expect(hmLink).toBeEnabled();
  console.log('All Products is restored; category and brand controls are usable.');
});
