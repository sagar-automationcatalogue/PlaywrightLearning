import { Page, Locator, expect } from "@playwright/test";

export class OrangeHRM_EmployeeManagement{
    page: Page;
    private firstEmployeeRow: Locator;
    private addEmployeeBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.firstEmployeeRow = page.locator(`//table[@id='employeeListTable']/tbody/tr[1]/td[3]/a`);
        this.addEmployeeBtn = page.locator(`#addEmployeeButton`);
    }

    async clickAddEmployee(){
        await expect(this.firstEmployeeRow).toBeVisible();
        await this.addEmployeeBtn.click();
        console.log(`Add Employee button is clicked`);
    }
}