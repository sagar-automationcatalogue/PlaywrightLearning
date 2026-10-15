import {test} from '@playwright/test';
import { OrangeHRM_LoginPage } from '../../../src/pages/OrangeHrm_LoginPage';
import { OrangeHRM_HomePage } from '../../../src/pages/OrangeHrm_HomePage';
import { OrangeHRM_EmployeeManagement } from '../../../src/pages/OrangeHRM_EmployeeManagement';

test(`OrangeHRM - Add Employee`, async({page})=>{
    await page.goto(`https://automaetesting-trials821.orangehrmlive.com/`);
    
    let ob = new OrangeHRM_LoginPage(page);
    await ob.login();

    let ob2 = new OrangeHRM_HomePage(page);
    await ob2.clickEmployeeManagement();

    let ob3 = new OrangeHRM_EmployeeManagement(page);
    await ob3.clickAddEmployee();

    await page.waitForTimeout(5000);
});