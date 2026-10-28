import { test } from '@playwright/test';
import { AutomationExercise_ProductsPage } from '../../../src/pages/AutomationExercise_ProductsPage';
import { HandlingPopups } from '../../../src/components/HandlingPopups';
import { PlaywrightUtils } from '../../../src/utils/PlaywrightUtils';
import { automationExerciseBaseURL } from '../../../src/config/EnvironmentConfig';

/** Testcase developed by Brahmam - Completed */
test('@sanity TC_02_AutomationExercise: Search Products, Validate Results, Hover and Open Details', async ({ page }) => {
  const productsPage = new AutomationExercise_ProductsPage(page);

  let ob_handlingPopups = new HandlingPopups();
  await ob_handlingPopups.handleGoogleAds(page);
  await PlaywrightUtils.navigateToURL(page, automationExerciseBaseURL);

  const baselineProductCount = await productsPage.openHomeAndProductsCatalog();
  const productNames = await productsPage.searchTopProductsAndVerifyRelatedCategories(baselineProductCount);
  const searchedPrices = await productsPage.captureAndValidateSearchPrices(productNames);

  // Select a result by its exact name, rather than by a card position.
  const selectedProductName = productNames[0].trim();
  const selectedProductPrice = searchedPrices[0].trim();
  await productsPage.openSelectedProductAndVerifyDetails(selectedProductName, selectedProductPrice);

  await productsPage.restoreCatalogAndSearchJeans(baselineProductCount);
});
