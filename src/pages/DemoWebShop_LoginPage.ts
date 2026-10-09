import { Page, Locator } from "@playwright/test";
import {TC_01_Authentication} from "../../test-data/demoWebShop";

export class DemoWebShop_LoginPage{
    private emailInput:Locator;
    private pwdInput:Locator;
    private loginBtn:Locator;
    private userNameLnk: Locator
    private logoutLnk: Locator;

    constructor(page: Page){
        this.emailInput = page.getByLabel('Email:', { exact: true });
        this.pwdInput = page.getByLabel('Password:', { exact: true });
        this.loginBtn = page.getByRole('button', { name: 'Log in', exact: true });
        this.userNameLnk = page.getByRole('link', { name: TC_01_Authentication.email, exact: true });
        this.logoutLnk = page.getByRole('link', { name: 'Log out', exact: true });
    }
}