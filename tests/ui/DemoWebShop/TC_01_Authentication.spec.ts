import { expect, test } from '@playwright/test';
import { TC_01_Authentication} from '../../../test-data/demoWebShop';
import { DemoWebShop_HomePage } from '../../../src/pages/DemoWebShop_HomePage';
import { DemoWebShop_LoginPage } from '../../../src/pages/DemoWebShop_LoginPage';
import { DemoWebShop_CustomerInfoPage } from '../../../src/pages/DemoWebShop_CustomerInfoPage';
import {demoWebShopBaseURL} from '../../../src/config/EnvironmentConfig';

test('@smoke TC_01_Authentication: Invalid Login, Valid Login and Logout', async ({ page }) => {
	// Step 1: Launch browser and open Demo Web Shop.
	console.log('Launching Demo Web Shop');
	await page.goto(demoWebShopBaseURL);

	// Step 2,3,4: Verify the home page is loaded.
	await expect(page).toHaveURL(demoWebShopBaseURL);
	let ob_DemoWebShopHomePage = new DemoWebShop_HomePage(page);
	ob_DemoWebShopHomePage.verifyDemoWebshopLinks();	
	ob_DemoWebShopHomePage.clickLoginLink();	
	
	// Step 5,6,7,8: Enter the registered email.
	let ob_DemoWebShopLogin = new DemoWebShop_LoginPage(page);
	ob_DemoWebShopLogin.verifyLoginPage();
	ob_DemoWebShopLogin.login_DemoWeshop(TC_01_Authentication.email, TC_01_Authentication.invalidPassword);

	// Steps 9-10: Verify the failure message and that the user remains on Login.
	ob_DemoWebShopLogin.verifyLoginErrorMsg();

	// Step 11,12: Clear & Enter the valid password
	ob_DemoWebShopLogin.enterPassword(TC_01_Authentication.validPassword);

	// Step 13: Select Remember me.
	ob_DemoWebShopLogin.checkRememberMe();

	// Step 14: Click Log in.
	ob_DemoWebShopLogin.clickLoginBtn();	

	// Steps 15-16: Verify the account email and Log out are displayed.
	ob_DemoWebShopLogin.verifyLoginLinks();

	// Step 17: Click the account email.
	ob_DemoWebShopLogin.clickAccountEmail();
	const accountUrl = page.url();

	// Step 18: Verify the customer/account page is displayed.
	let ob_DemoWebShopCustomerInfo  = new DemoWebShop_CustomerInfoPage(page);
	ob_DemoWebShopCustomerInfo.verifyCustomerInfoPage();

	// Step 19: Navigate back to the home page while the session remains active.
	ob_DemoWebShopHomePage.verifyDemoWebShopHome();
	ob_DemoWebShopLogin.verifyLoginLinks();

	// Step 20: Click Log out.	
	ob_DemoWebShopLogin.clickLogout();

	// Step 21: Verify Log in appears again.
	ob_DemoWebShopHomePage.verifyDemoWebShopHome();

});
