import { test } from '../../../src/fixtures/test-fixtures';
import { TC_01_Authentication } from '../../../test-data/demoWebShop';
import { DemoWebShop_HomePage } from '../../../src/pages/DemoWebShop_HomePage';
import { DemoWebShop_CustomerInfoPage } from '../../../src/pages/DemoWebShop_CustomerInfoPage';

test('@smoke TC_01_Authentication: Invalid Login, Valid Login and Logout', async ({ page, login_demoWebShop }) => {

	// Steps 9-10: Verify the failure message and that the user remains on Login.
	await login_demoWebShop.verifyLoginErrorMsg();

	// Step 11,12: Clear & Enter the valid password
	await login_demoWebShop.enterPassword(TC_01_Authentication.validPassword);

	// Step 13: Select Remember me.
	await login_demoWebShop.checkRememberMe();

	// Step 14: Click Log in.
	await login_demoWebShop.clickLoginBtn();

	// Steps 15-16: Verify the account email and Log out are displayed.
	await login_demoWebShop.verifyLoginLinks();

	// Step 17: Click the account email.
	await login_demoWebShop.clickAccountEmail();

	// Step 18: Verify the customer/account page is displayed.
	const ob_DemoWebShopCustomerInfo = new DemoWebShop_CustomerInfoPage(page);
	await ob_DemoWebShopCustomerInfo.verifyCustomerInfoPage();

	// Step 19: Navigate back to the home page while the session remains active.
	const ob_DemoWebShopHomePage = new DemoWebShop_HomePage(page);
	await ob_DemoWebShopHomePage.verifyDemoWebShopHome();
	await login_demoWebShop.verifyLoginLinks();

	// Step 20: Click Log out.	
	await login_demoWebShop.clickLogout();

	// Step 21: Verify Log in appears again.
	await ob_DemoWebShopHomePage.verifyDemoWebShopHome();

});
