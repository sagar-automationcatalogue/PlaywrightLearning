import { Page, Locator, expect } from "@playwright/test";
import {TC_01_Authentication} from "../../test-data/demoWebShop";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";
import { HeaderComponents } from "../components/HeaderComponents";
import { PlaywrightUtils } from "../utils/PlaywrightUtils";

export class ThinkingTester_LoginPage{
    page: Page;
    private emailInput:Locator;
    private pwdInput:Locator;
    private submitBtn:Locator;
    

    constructor(page: Page){
        this.page = page;        
        this.emailInput = page.getByPlaceholder(`Email`);
        this.pwdInput = page.getByPlaceholder(`Password`);
        this.submitBtn = page.locator(`#submit`);
    }

    async login_ThinkingTester(email:string, pwd:string): Promise<void>{
        console.log('Entering credentials for the login attempt');
        await PlaywrightUtils.clearAndFillInput( this.emailInput, email, 'Email Text-box');
        await PlaywrightUtils.clearAndFillInput( this.pwdInput, pwd, 'Password Text-box');
        await this.submitBtn.click();
        console.log(`Logged in to Thinkin Tester application`)
    }

    
}