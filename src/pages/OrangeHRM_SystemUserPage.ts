import { Page, Locator, expect } from "@playwright/test";

export class OrangeHRM_SystemUserPage{
    page: Page;
    private hrAdministrationLink: Locator;
    private userManagementHeading: Locator;
    private addUserButton: Locator;
    private employeeSearchInput: Locator;
    private employeeSuggestion: (employeeName: string) => Locator;
    private usernameInput: Locator;
    private essRoleDropdown: Locator;
    private supervisorRoleDropdown: Locator;
    private adminRoleDropdown: Locator;
    private roleOption: (role: string) => Locator;
    private passwordInput: Locator;
    private confirmPasswordInput: Locator;
    private modalSaveButton: Locator;
    private closeButton: Locator;    
    private userRow: (username: string) => Locator;    
    private userStatusOption: (status: string) => Locator;    

    constructor(page: Page){
        this.page = page;
        this.hrAdministrationLink = page.locator("//span[text()='HR Administration']").first();
        this.userManagementHeading = page.locator('.highlight.bordered');
        this.addUserButton = page.locator("//i[text()='add']");
        this.employeeSearchInput = page.locator('#selectedEmployee_value');
        this.employeeSuggestion = (employeeName: string) =>
            page.locator('.angucomplete-row').filter({ hasText: employeeName });
        this.usernameInput = page.locator('#user_name');
        this.essRoleDropdown = page.locator('div[name="essrole"]');
        this.supervisorRoleDropdown = page.locator('div[name="supervisorrole"]');
        this.adminRoleDropdown = page.locator('div[name="adminrole"]');
        this.roleOption = (role: string) => page.getByRole('option', { name: role });
        this.passwordInput = page.getByPlaceholder('Enter Password');
        this.confirmPasswordInput = page.getByPlaceholder('Confirm Password');
        this.modalSaveButton = page.locator('#modal-save-button');
        this.closeButton = page.locator('button.btn.btn-close');        
        this.userRow = (username: string) => page.getByRole('row', { name: new RegExp(username, 'i') }).first();        
        this.userStatusOption = (status: string) => page.getByText(status, { exact: true });        
    }

    async createUser(
        employeeSearchText: string,
        employeeName: string,
        username: string,
        essRole: string,
        supervisorRole: string,
        adminRole: string,
        password: string
    ): Promise<void>{
        await this.hrAdministrationLink.click();
        await expect(this.userManagementHeading).toBeVisible();
        await this.addUserButton.click();

        await this.employeeSearchInput.click();
        await this.employeeSearchInput.pressSequentially(employeeSearchText, { delay: 150 });
        await expect(this.employeeSuggestion(employeeName)).toBeVisible();
        await this.employeeSuggestion(employeeName).click();

        await this.usernameInput.fill(username);
        await this.essRoleDropdown.click();
        await this.roleOption(essRole).click();
        await this.supervisorRoleDropdown.click();
        await this.roleOption(supervisorRole).click();
        await this.adminRoleDropdown.click();
        await this.roleOption(adminRole).click();
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
        await expect(this.modalSaveButton).toBeEnabled();
        await this.page.waitForTimeout(3000);
        await this.modalSaveButton.click();
        await this.modalSaveButton.click();

        if (await this.closeButton.isVisible()) {
            await this.closeButton.click();
        }
    }
}
