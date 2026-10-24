import { test } from '@playwright/test';
import { DemoWebShop_HomePage } from '../../../src/pages/DemoWebShop_HomePage';
import { DemoWebShop_LoginPage } from '../../../src/pages/DemoWebShop_LoginPage';
import { DemoWebShop_CustomizedComputerPage } from '../../../src/pages/DemoWebShop_CustomizedComputerPage';
import { TC_04_BuildCustomizedComputer } from '../../../test-data/demoWebShop';
import { demoWebShopBaseURL } from '../../../src/config/EnvironmentConfig';

test('@regression TC_04_BuildCustomizedComputer: Configure a computer, verify cart prices and remove it', async ({ page }) => {
    const homePage = new DemoWebShop_HomePage(page);
    const loginPage = new DemoWebShop_LoginPage(page);
    const customizedComputerPage = new DemoWebShop_CustomizedComputerPage(page);

    // Step 1: Log in with the existing user.
    await page.goto(demoWebShopBaseURL);
    await homePage.clickLoginLink();
    await loginPage.login_DemoWeshop(TC_04_BuildCustomizedComputer.email, TC_04_BuildCustomizedComputer.password);
    await loginPage.verifyLoginSuccessful();
    console.log('Step 1: Existing user is authenticated.');

    const initialCartState = await customizedComputerPage.captureInitialCartState();
    await customizedComputerPage.openComputersAndVerifyCategories();
    await customizedComputerPage.openDesktopsAndVerifyProducts();
    const basePrice = await customizedComputerPage.openComputerAndVerifyBasePrice();
    const expectedUnitPrice = await customizedComputerPage.configureComputerAndSetQuantity(basePrice);

    // Cleanup in finally also runs when an assertion after adding the product fails.
    try {
        await customizedComputerPage.addConfiguredComputerAndVerifyCart(
            initialCartState.initialCartCount,
            expectedUnitPrice
        );
    } finally {
        // Step 31: Remove only the configured computer added by this test.
        await customizedComputerPage.removeConfiguredComputerAndVerifyCart(initialCartState);
    }
});
