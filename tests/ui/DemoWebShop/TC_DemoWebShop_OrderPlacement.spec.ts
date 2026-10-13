import { test } from '@playwright/test';
import {DemoWebShop_HomePage} from '../../../src/pages/DemoWebShop_HomePage.ts'
import {DemoWebShop_LoginPage } from '../../../src/pages/DemoWebShop_LoginPage.ts';
import {DemoWebShop_CataloguePage} from '../../../src/pages/DemoWebShop_CataloguePage.ts'
import {DemoWebShop_ShoppingCartPage} from '../../../src/pages/DemoWebshop_ShoppingCartPage.ts'
import { DemoWebShop_CheckoutPage } from '../../../src/pages/DemoWebShop_CheckoutPage.ts';
import { DemoWebShop_OrdersPage } from '../../../src/pages/DemoWebShop_OrdersPage.ts';
import { TC_01_Authentication } from '../../../test-data/demoWebShop.ts';

test('@regression TC_DemoWebShop_OrderPlacement: Place an order for a notebook', async ({ page }) => {
    //HomePage

    console.log('Opening Demo Web Shop and logging in');
    await page.goto('https://demowebshop.tricentis.com/');    
    let ob_HomePage = new DemoWebShop_HomePage(page);
    await ob_HomePage.clickLoginLink();

    //LoginPage
    let ob_LoginPage = new DemoWebShop_LoginPage(page);
    await ob_LoginPage.login_DemoWeshop(TC_01_Authentication.email, TC_01_Authentication.validPassword);
    await ob_LoginPage.verifyLoginSuccessful();

    //CataloguePage
    let ob_CataloguePage = new DemoWebShop_CataloguePage(page);
    await ob_CataloguePage.openProductCategory();
    await ob_CataloguePage.addToCart_Product();

    //ShoppingCartPage
    let ob_ShoppingCartPage = new DemoWebShop_ShoppingCartPage(page);
    await ob_ShoppingCartPage.clickShoppingCart();
    await ob_ShoppingCartPage.updateShoppingCart();
    await ob_ShoppingCartPage.acceptTermsService();
    await ob_ShoppingCartPage.clickCheckoutBtn();    
    
    //CheckoutPage
    let ob_CheckoutPage = new DemoWebShop_CheckoutPage(page);
    await ob_CheckoutPage.selectBillingAddress();
    await ob_CheckoutPage.selectShippingAddress();
    await ob_CheckoutPage.selectDeliveryOption();
    await ob_CheckoutPage.selectPaymentOption();
    await ob_CheckoutPage.confirmOrder();

    //OrdersPage
    let ob_OrdersPage = new DemoWebShop_OrdersPage(page);
    await ob_OrdersPage.verifyOrderNumber();
   
});
