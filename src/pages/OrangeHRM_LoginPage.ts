import { Page, Locator } from "@playwright/test";
import {OrangeHRM_Data} from '../../test-data/orangeHRM';

export class OrangeHRM_LoginPage{
    page: Page;
    usernameInput:Locator;
    pwdInput: Locator;
    loginBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.usernameInput = page.locator('#txtUsername');
        this.pwdInput = page.getByPlaceholder(`Password`);
        this.loginBtn = page.getByText(`Login`).last();
    }

    async login(){
        await this.usernameInput.fill(OrangeHRM_Data.username);
        await this.pwdInput.fill(OrangeHRM_Data.pwd)
        await this.loginBtn.click();
    }
}