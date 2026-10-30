
import { test as base,expect } from '@playwright/test';
import { DemoWebShop_LoginPage } from '../pages/DemoWebShop_LoginPage';
import {TC_01_Authentication} from '../../test-data/demoWebShop';
import { PlaywrightUtils } from '../utils/PlaywrightUtils';
import {demoWebShopBaseURL} from '../config/EnvironmentConfig';
import { DemoWebShop_HomePage } from '../pages/DemoWebShop_HomePage';

export const test = base.extend<{login_demoWebShop: DemoWebShop_LoginPage}>({
    login_demoWebShop: async ({ page }, use) =>{
        // Step 1: Launch browser and open Demo Web Shop.
	    console.log('Launching Demo Web Shop');
	    await PlaywrightUtils.navigateToURL(page, demoWebShopBaseURL);

	    // Step 2,3,4: Verify the home page is loaded.
	    await expect(page).toHaveURL(demoWebShopBaseURL);
	    const ob_DemoWebShopHomePage = new DemoWebShop_HomePage(page);
	    await ob_DemoWebShopHomePage.verifyDemoWebshopLinks();
	    await ob_DemoWebShopHomePage.clickLoginLink();
	
	    // Step 5,6,7,8: Enter the registered email.
	    const ob_DemoWebShopLogin = new DemoWebShop_LoginPage(page);
	    await ob_DemoWebShopLogin.verifyLoginPage();
	    await ob_DemoWebShopLogin.login_DemoWeshop(TC_01_Authentication.email, TC_01_Authentication.invalidPassword);
        await use(ob_DemoWebShopLogin);
    }
});