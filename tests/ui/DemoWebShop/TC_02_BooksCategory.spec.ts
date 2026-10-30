import { test } from '../../../src/fixtures/test-fixtures';
import { DemoWebShop_HomePage } from '../../../src/pages/DemoWebShop_HomePage';
import { DemoWebShop_CataloguePage } from '../../../src/pages/DemoWebShop_CataloguePage';

test('@sanity TC_02_BooksCategory: Verify sorting, price filtering, page size and view', async ({ page, login_demoWebShop: _login_demoWebShop }) => {
    // Step 1: Open Demo Web Shop and verify the home page.
    let ob1 = new DemoWebShop_HomePage(page);
    await ob1.openDemoWebShopAndVerifyHomePage();

    // Steps 2-3: Open Books and verify the category heading.
    let ob2 = new DemoWebShop_CataloguePage(page);
    await ob2.openBooksCategory();

    // Steps 4-5: Capture the product names and verify that products are displayed.
    let initialProductNames: string[] = await ob2.captureInitialProductNames();

    // Steps 6-10: Sort product names from A to Z and compare with a sorted copy.
    await ob2.sortProductsByNameAndVerify();

    // Steps 11-14: Sort by price and verify each price is no lower than the previous one.
    await ob2.sortProductsByPriceAndVerify();

    // Steps 18-21: Change the page size and view before filtering.
    await ob2.changePageSizeAndView();

    // Steps 15-17: Apply the price filter and verify any returned prices are in range.
    let filteredPrices: number = await ob2.applyPriceFilterAndVerify();

    // Steps 22-23: Remove the filter and verify that the broader product list returns.
    await ob2.removePriceFilterAndVerify(initialProductNames, filteredPrices, 4);
});
