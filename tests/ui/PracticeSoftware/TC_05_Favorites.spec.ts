import { test } from '@playwright/test';
import { TC_05_Favorites } from '../../../test-data/practiceSoftware.ts';
import { PracticeSoftware_RegistrationPage } from '../../../src/pages/PracticeSoftware_RegistrationPage.ts';
import { PracticeSoftware_LoginPage } from '../../../src/pages/PracticeSoftware_LoginPage.ts';
import { PracticeSoftware_HomePage } from '../../../src/pages/PracticeSoftware_HomePage.ts';
import { PracticeSoftware_CataloguePage } from '../../../src/pages/PracticeSoftware_CataloguePage.ts';
import { PracticeSoftware_ProductPage } from '../../../src/pages/PracticeSoftware_ProductPage.ts';
import { PracticeSoftware_FavoritesPage } from '../../../src/pages/PracticeSoftware_FavoritesPage.ts';

test('@sanity TC_05_Favorites: Add Multiple Products → Validate → Remove', async ({ page }) => {
    const toolshopUrl = 'https://practicesoftwaretesting.com/';
    const email = TC_05_Favorites.email;
    const password = TC_05_Favorites.password;
    const registrationPage = new PracticeSoftware_RegistrationPage(page);
    const loginPage = new PracticeSoftware_LoginPage(page);
    const homePage = new PracticeSoftware_HomePage(page);
    const cataloguePage = new PracticeSoftware_CataloguePage(page);
    const productPage = new PracticeSoftware_ProductPage(page);
    const favoritesPage = new PracticeSoftware_FavoritesPage(page);

    await registrationPage.openRegistrationPage(toolshopUrl);
    await page.route(/zippopotam|postcode|postal|zip/i, async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                street: 'Playwright Training Street',
                house_number: '42',
                city: 'Vienna',
                state: 'Vienna',
                country: 'Austria',
                postcode: '1010',
            }),
        });
    });
    await registrationPage.registerFavoritesAccount(email, password, TC_05_Favorites.emptyValue);

    await loginPage.openFavoritesLoginPage(`${toolshopUrl}auth/login`);
    await loginPage.loginFavoritesAccount(email, password);

    await homePage.openHomeAndVerifyNavigation(toolshopUrl);
    await cataloguePage.verifyCatalogProductsLoaded();

    // Clear this account's previous favorite entries so the test starts clean.
    await favoritesPage.clearExistingFavoritesFromHome();
    await homePage.openHomeAndVerifyNavigation(toolshopUrl);
    await cataloguePage.verifyCatalogProductsLoaded();

    await cataloguePage.searchAndOpenFavoriteProduct(
        TC_05_Favorites.searchTerms.firstProduct,
        TC_05_Favorites.searchTerms.firstProduct
    );
    await productPage.addToFavorites();

    await homePage.openHomeAndVerifyNavigation(toolshopUrl);
    await cataloguePage.verifyCatalogProductsLoaded();
    const selectedHammerName = await cataloguePage.searchAndOpenAvailableHammer();
    await productPage.verifyAvailableAndAddToFavorites();

    await homePage.openHomeAndVerifyNavigation(toolshopUrl);
    await cataloguePage.verifyCatalogProductsLoaded();
    await favoritesPage.openFavoritesFromHomeViaAccount();
    await favoritesPage.verifyBothFavoritesAndRemove(
        TC_05_Favorites.searchTerms.firstProduct,
        selectedHammerName
    );

    await homePage.openHomeAndVerifyNavigation(toolshopUrl);
    await cataloguePage.searchAndOpenFavoriteProduct(
        TC_05_Favorites.searchTerms.firstProduct,
        TC_05_Favorites.searchTerms.firstProduct
    );
    await productPage.verifyFavoriteActionVisible();
    await favoritesPage.signOutFromHome();
});
