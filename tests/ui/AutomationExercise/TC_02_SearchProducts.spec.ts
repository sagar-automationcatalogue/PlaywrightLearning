import { test } from '@playwright/test';
import { AutomationExercise_ProductsPage } from '../../../src/pages/AutomationExercise_ProductsPage.ts';

/** Testcase developed by Brahmam - Completed */
test('@sanity TC_02_AutomationExercise: Search Products, Validate Results, Hover and Open Details', async ({ page }) => {
  const productsPage = new AutomationExercise_ProductsPage(page);

  // Prevent third-party advertisements from covering the product actions.
  await page.route(/googleads|googlesyndication|doubleclick|googletagservices|adservice\.google/, route => route.abort());

  const baselineProductCount = await productsPage.openHomeAndProductsCatalog();
  const productNames = await productsPage.searchTopProductsAndVerifyRelatedCategories(baselineProductCount);
  const searchedPrices = await productsPage.captureAndValidateSearchPrices(productNames);

  // Select a result by its exact name, rather than by a card position.
  const selectedProductName = productNames[0].trim();
  const selectedProductPrice = searchedPrices[0].trim();
  await productsPage.openSelectedProductAndVerifyDetails(selectedProductName, selectedProductPrice);

  await productsPage.restoreCatalogAndSearchJeans(baselineProductCount);
});
