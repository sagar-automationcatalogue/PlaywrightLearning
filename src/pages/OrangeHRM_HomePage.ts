import {Page, Locator, expect} from '@playwright/test'
import { TC_01_LoginOrangeHrm } from '../../test-data/orangeHRM';
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";

export class OrangeHRM_HomePage{
    page: Page;
    private employeeManagementLnk: Locator;
    private dashboardText: Locator;
    private userMenu: Locator;
    private logoutFromAllBrowsersLink: Locator;
    private logoutButton: Locator;
    private loginButton: Locator;
    private employeeListMenuItem: Locator;
    private employeeManagementLink: Locator;

    constructor(page: Page){
        this.page = page;
        this.employeeManagementLnk = page.locator(`span[data-tooltip='Employee Management']`).first();
        this.dashboardText = page.getByText(Constants.OrangeHRM.dashboardText, { exact: true });
        this.userMenu = page.getByRole('link', { name: 'arrow_drop_down' });
        this.logoutFromAllBrowsersLink = page.getByRole('link', { name: 'Logout from all browsers' });
        this.logoutButton = page.getByRole('link', { name: 'oxd_logout_round Log Out' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.employeeListMenuItem = page.locator('[data-automation-id="menu_pim_viewEmployeeList"]').first();
        this.employeeManagementLink = page.getByRole('link', { name: 'Employee Management', exact: true });
    }

    async verifyDashboard(): Promise<void>{
        await expect(this.page).toHaveURL(new RegExp(URLConfig.UI.OrangeHRM.dashboardPathURL, 'i'));
        await expect(this.dashboardText.first()).toBeVisible();
    }

    async verifyDashboardLoaded(): Promise<void>{
        await this.page.waitForURL(new RegExp(URLConfig.UI.OrangeHRM.dashboardPathURL), { timeout: 30000 });
    }

    async clickEmployeeList(): Promise<void>{
        await this.employeeListMenuItem.click();
    }

    async logout(): Promise<void>{
        await expect(this.userMenu).toBeVisible();
        await this.userMenu.click();
        await expect(this.logoutFromAllBrowsersLink).toBeVisible();
        await expect(this.logoutButton).toBeVisible();
        await this.logoutButton.click({ noWaitAfter: true });
    }

    async goBackAndVerifyDashboardUnavailable(): Promise<void>{
        await this.page.goBack();
        await expect(this.loginButton).toBeVisible();
        await expect(this.dashboardText).toHaveCount(0);
    }

    async verifyEmployeeManagementVisible(): Promise<void>{
        await expect(this.employeeManagementLnk).toBeVisible();
        console.log('Step 1.5: Confirm Admin is authenticated');
    }

    async clickEmployeeManagement(noWaitAfter: boolean = false){
        await this.employeeManagementLink.click({ noWaitAfter });
        console.log(`EmployeeManagement link is clicked`);
    }

}
