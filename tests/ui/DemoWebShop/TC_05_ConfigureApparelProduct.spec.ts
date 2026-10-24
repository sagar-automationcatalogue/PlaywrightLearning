import { test } from '@playwright/test';
import { DemoWebShop_HomePage } from '../../../src/pages/DemoWebShop_HomePage';
import { DemoWebShop_LoginPage } from '../../../src/pages/DemoWebShop_LoginPage';
import { DemoWebShop_ApparelProductPage } from '../../../src/pages/DemoWebShop_ApparelProductPage';
import { TC_05_ConfigureApparelProduct } from '../../../test-data/demoWebShop';
import { demoWebShopBaseURL } from '../../../src/config/EnvironmentConfig';

test('@regression TC_05_ConfigureApparelProduct: Add sneaker to wishlist and cart', async ({ page }) => {
    const homePage = new DemoWebShop_HomePage(page);
    const loginPage = new DemoWebShop_LoginPage(page);
    const apparelProductPage = new DemoWebShop_ApparelProductPage(page);

    // Step 1: Log in with the existing user.
    console.log('Opening Demo Web Shop and logging in');
    await page.goto(demoWebShopBaseURL);
    await homePage.clickLoginLink();
    await loginPage.login_DemoWeshop(TC_05_ConfigureApparelProduct.email, TC_05_ConfigureApparelProduct.password);
    await loginPage.verifyLoginSuccessful();
    console.log('User is authenticated');

    const startingCounts = await apparelProductPage.removePreviousSneakerEntriesAndCaptureCounts();
    const catalogPrice = await apparelProductPage.openApparelCategoryAndCapturePrice();
    await apparelProductPage.configureSneakerAndAddToWishlist(startingCounts.wishlist);
    await apparelProductPage.addWishlistSneakerToCartAndVerify(startingCounts.cart, catalogPrice);
    await apparelProductPage.removeSneakerFromCart();
});
