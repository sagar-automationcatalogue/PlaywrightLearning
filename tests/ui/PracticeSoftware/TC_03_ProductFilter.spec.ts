import { test } from '@playwright/test';
import { TC_03_ProductFilter } from '../../../test-data/practiceSoftware';
import { PracticeSoftware_HomePage } from '../../../src/pages/PracticeSoftware_HomePage';
import { PracticeSoftware_CataloguePage } from '../../../src/pages/PracticeSoftware_CataloguePage';
import { practiceSoftwareTestingBaseURL } from '../../../src/config/EnvironmentConfig';
import { PlaywrightUtils } from '../../../src/utils/PlaywrightUtils';

test('@sanity TC_03_ProductFilter - Category + Brand + Price filtering', async ({ page }) => {
  const homePage = new PracticeSoftware_HomePage(page);
  const cataloguePage = new PracticeSoftware_CataloguePage(page);

  console.log('1. Open the product catalog');
  await PlaywrightUtils.navigateToURL(page, practiceSoftwareTestingBaseURL);
  await homePage.openHomeAndVerifyNavigation(practiceSoftwareTestingBaseURL, false);
  const initialProductCount = await cataloguePage.captureInitialFilterProductCount();

  console.log('3. Locate the category filter section');
  await cataloguePage.filterByCategoryAndSubcategory(
    TC_03_ProductFilter.category,
    TC_03_ProductFilter.subcategory,
    initialProductCount
  );

  console.log('11. Locate the Brand filter section');
  const selectedBrand = await cataloguePage.selectDynamicBrand();

  await cataloguePage.applyPriceRangeAndVerify(
    TC_03_ProductFilter.priceRange.filteredMinimum,
    TC_03_ProductFilter.priceRange.filteredMaximum
  );

  await cataloguePage.openFilteredProductAndVerify(selectedBrand);
  await cataloguePage.returnToFilteredCatalogAndRemoveBrand(selectedBrand);
  await cataloguePage.resetFiltersAndVerifyBaseline(
    TC_03_ProductFilter.category,
    TC_03_ProductFilter.subcategory,
    TC_03_ProductFilter.priceRange.resetMinimum,
    TC_03_ProductFilter.priceRange.resetMaximum,
    initialProductCount
  );
});
