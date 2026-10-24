import { test } from '@playwright/test';
import { TC_02_ProductSearch } from '../../../test-data/practiceSoftware';
import { PracticeSoftware_HomePage } from '../../../src/pages/PracticeSoftware_HomePage';
import { PracticeSoftware_CataloguePage } from '../../../src/pages/PracticeSoftware_CataloguePage';
import { practiceSoftwareTestingBaseURL } from '../../../src/config/EnvironmentConfig';

test('@sanity TC_02_PracticeSoftware_ProductSearch: Search → Sort → Pagination → Reset', async ({ page }) => {
    const homeUrl = practiceSoftwareTestingBaseURL;
    const homePage = new PracticeSoftware_HomePage(page);
    const cataloguePage = new PracticeSoftware_CataloguePage(page);

    await homePage.openHomeAndVerifyNavigation(homeUrl);
    const initialCount = await cataloguePage.captureInitialProductCount();

    const pliersNames = await cataloguePage.searchAndVerifyResults(
        TC_02_ProductSearch.searchTerms.primary,
        true
    );
    console.log('Pliers search results:', pliersNames);
    await cataloguePage.verifySearchUrlIfApplicable(TC_02_ProductSearch.searchTerms.primary);

    // Sort product names A-Z and compare the displayed order with localeCompare.
    await cataloguePage.sortByNameAndVerify(TC_02_ProductSearch.sortByName);

    // Sort by ascending price and verify every adjacent pair is ordered.
    await cataloguePage.sortByPriceAndVerify(TC_02_ProductSearch.sortByPrice);

    // Search results may fit on one page; exercise pagination only when Next is available.
    await cataloguePage.exercisePaginationIfAvailable();

    // Clear the query and confirm the broader catalog is restored.
    await cataloguePage.clearSearchAndVerifyCatalogRestored(initialCount);

    // Run an independent hammer search, then clear it again.
    await cataloguePage.searchAndVerifyResults(
        TC_02_ProductSearch.searchTerms.alternate,
        false
    );
    await cataloguePage.clearSearchAndVerifyProductsAvailable();
});
