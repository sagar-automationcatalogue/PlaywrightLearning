import { Page, Locator, expect } from "@playwright/test";
import {TC_01_Authentication} from "../../test-data/demoWebShop";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";

export class DemoWebShop_LoginPage{
    page: Page;
    private emailInput:Locator;
    private pwdInput:Locator;
    private loginBtn:Locator;
    private userNameLnk: Locator
    private logoutLnk: Locator;
    private loginHdr: Locator;
    private loginErrorTxt: Locator;
    private rememberMeChkbx: Locator;
    private accountEmailLink: Locator;

    constructor(page: Page){
        this.page = page;
        this.emailInput = page.getByLabel('Email:', { exact: true });
        this.pwdInput = page.getByLabel('Password:', { exact: true });
        this.loginBtn = page.getByRole('button', { name: 'Log in', exact: true });
        this.userNameLnk = page.getByRole('link', { name: TC_01_Authentication.email, exact: true });
        this.logoutLnk = page.getByRole('link', { name: 'Log out', exact: true });
        this.loginHdr = page.getByRole('heading', { name: Constants.DemoWebShop.headings.login, exact: true });
        this.loginErrorTxt = page.locator('.validation-summary-errors');
        this.rememberMeChkbx = page.getByRole('checkbox', { name: 'Remember me?' });
        this.accountEmailLink = page.getByRole('link', { name: TC_01_Authentication.email, exact: true });
    }

    async login_DemoWeshop(email:string, pwd:string): Promise<void>{
        console.log('Entering credentials for the login attempt');
        await this.emailInput.fill(email);
        await expect(this.emailInput).toHaveValue(email);

        await this.pwdInput.fill(pwd);
        await expect(this.pwdInput).toHaveValue(pwd);
        await this.loginBtn.click();
    }

    async enterPassword(pwd: string){
        await this.pwdInput.clear();
	    await expect(this.pwdInput).toHaveValue(Constants.emptyValue);
        await this.pwdInput.fill(pwd);
	    await expect(this.pwdInput).toHaveValue(pwd);
    }

    async verifyLoginSuccessful(): Promise<void>{
        await expect(this.userNameLnk).toBeVisible();
        await expect(this.logoutLnk).toBeVisible();
        console.log('Login completed');
    }

    async verifyLoginPage(): Promise<void>{         
	    await expect(this.loginHdr).toBeVisible();
    }

    async verifyLoginErrorMsg(): Promise<void>{
        console.log('Verifying the invalid login result');	    
	    await expect(this.loginErrorTxt).toBeVisible();
	    await expect(this.loginErrorTxt).not.toBeEmpty();
	    await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.DemoWebShop.loginURL));
    }

    async checkRememberMe(): Promise<void>{        
	    await this.rememberMeChkbx.check();
	    await expect(this.rememberMeChkbx).toBeChecked();
    }

    async clickLoginBtn(){
        await this.loginBtn.click();
    }

    async verifyLoginLinks(){        
	    await expect(this.accountEmailLink).toBeVisible();
	    await expect(this.logoutLnk).toBeVisible();
    }

    async clickAccountEmail(){
        await this.accountEmailLink.click();
    }

    async clickLogout(){
        console.log('Logging out and checking protected-page access');
        await this.logoutLnk.click();
    }
}