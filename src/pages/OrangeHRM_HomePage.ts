import {Page, Locator} from '@playwright/test'

export class OrangeHRM_HomePage{
    page: Page;
    private employeeManagementLnk: Locator;

    constructor(page: Page){
        this.page = page;
        this.employeeManagementLnk = page.locator(`span[data-tooltip='Employee Management']`).first();
    }

    async clickEmployeeManagement(){
        await this.employeeManagementLnk.click();
        console.log(`EmployeeManagement link is clicked`);
    }

}