import {test} from '@playwright/test';
import { OrangeHRM_LoginPage } from '../../../src/pages/OrangeHrm_LoginPage';

test(`OrangeHRM - Add Employee`, async({page})=>{
    await page.goto(`https://automaetesting-trials821.orangehrmlive.com/`);
    
    let ob = new OrangeHRM_LoginPage(page);
    ob.login();
});