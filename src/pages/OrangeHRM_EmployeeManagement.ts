import { Page, Locator, expect } from "@playwright/test";

export class OrangeHRM_EmployeeManagement{
    page: Page;
    private firstEmployeeRow: Locator;
    private addEmployeeBtn: Locator;

    private employeeTable: Locator;
    private employeeRows: Locator;
    private employeeNameSearch: Locator;
    private autocompleteSuggestions: Locator;
    private quickSearchButton: Locator;
    private filterButton: Locator;
    private filterHeading: Locator;
    private filterSearchButton: Locator;
    private resetButton: Locator;
    private employeeIdFilter: Locator;
    private makeFilterDefault: Locator;
    private jobTitleDropdown: Locator;
    private jobTitleCells: Locator;
    private locationDropdown: Locator;
    private makeFilterDefaultLabel: Locator;
    private locationCells: Locator;
    private expectedEmployeeSuggestion: (employeeName: string) => Locator;
    private selectedEmployeeRow: (employeeName: string) => Locator;
    private selectedEmployeeId: (employeeName: string) => Locator;
    private jobTitleOption: (jobTitle: string) => Locator;
    private locationOption: (location: string) => Locator;
    private nonMatchingJobTitleCells: (jobTitle: string) => Locator;
    private nonMatchingLocationCells: (location: string) => Locator;
    private attachmentEmployeeNameSearch: Locator;
    private attachmentAutocompleteSuggestions: Locator;
    private attachmentQuickSearchButton: Locator;
    private attachmentEmployeeTable: Locator;
    private attachmentEmployeeRows: Locator;

    constructor(page: Page){
        this.page = page;
        this.firstEmployeeRow = page.locator(`//table[@id='employeeListTable']/tbody/tr[1]/td[3]/a`);
        this.addEmployeeBtn = page.locator(`#addEmployeeButton`);
        this.employeeTable = page.locator('#employeeListTable');
        this.employeeRows = page.locator('#employeeListTable tbody tr');
        this.employeeNameSearch = page.locator('#employee_name_quick_filter_employee_list_value');
        this.autocompleteSuggestions = page.locator('#employee_name_quick_filter_employee_list_dropdown .angucomplete-row');
        this.quickSearchButton = page.locator('.employee-navbar-button').first();
        this.filterButton = page.locator('.employee-navbar-button').nth(1);
        this.filterHeading = page.getByRole('heading', { name: 'Filter Employees By' });
        this.filterSearchButton = page.getByRole('link', { name: 'Search', exact: true }).last();
        this.resetButton = page.getByRole('link', { name: 'Reset', exact: true }).last();
        this.employeeIdFilter = page.locator('#emp_search_mdl_employee_id_filter');
        this.makeFilterDefault = page.locator('#emp_search_mdl_persist_filters_as_default');
        this.jobTitleDropdown = page.locator('input.select-dropdown').nth(2);
        this.jobTitleCells = this.employeeRows.locator('td:nth-child(4)');
        this.locationDropdown = page.locator('input.select-dropdown').nth(5);
        this.makeFilterDefaultLabel = page.getByText('Make Filter Default', { exact: true });
        this.locationCells = this.employeeRows.locator('td:nth-child(8)');
        this.expectedEmployeeSuggestion = (employeeName: string) => this.autocompleteSuggestions.filter({ hasText: new RegExp(employeeName.replace(' ', '\\s+')) }).first();
        this.selectedEmployeeRow = (employeeName: string) => this.employeeRows.filter({ hasText: new RegExp(employeeName.replace(' ', '\\s+')) }).first();
        this.selectedEmployeeId = (employeeName: string) => this.selectedEmployeeRow(employeeName).locator('td').nth(1);
        this.jobTitleOption = (jobTitle: string) => page.locator('.dropdown-content:visible').getByText(jobTitle, { exact: true });
        this.locationOption = (location: string) => page.locator('.dropdown-content:visible').getByText(location, { exact: true });
        this.nonMatchingJobTitleCells = (jobTitle: string) => this.jobTitleCells.filter({ hasNotText: jobTitle });
        this.nonMatchingLocationCells = (location: string) => this.locationCells.filter({ hasNotText: location });
        this.attachmentEmployeeNameSearch = page.locator('#employee_name_quick_filter_employee_list_value');
        this.attachmentAutocompleteSuggestions = page.locator('#employee_name_quick_filter_employee_list_dropdown .angucomplete-row');
        this.attachmentQuickSearchButton = page.locator('.employee-navbar-button').first();
        this.attachmentEmployeeTable = page.locator('#employeeListTable');
        this.attachmentEmployeeRows = page.locator('#employeeListTable tbody tr');
    }

    async clickAddEmployee(){
        await expect(this.firstEmployeeRow).toBeVisible();
        await this.addEmployeeBtn.click();
        console.log(`Add Employee button is clicked`);
    }

    async verifyEmployeeListOpened(): Promise<void>{
        await this.page.waitForURL(/.*pim.*employees/, { timeout: 30000 });
    }

    async openEmployeeProfile(employeeName: string): Promise<void>{
        const employeeLink = this.page.getByText(employeeName, { exact: true });
        await expect(employeeLink).toBeVisible({ timeout: 30000 });
        await employeeLink.first().click();
        await expect(this.page.getByText('Profile', { exact: true })).toBeVisible({ timeout: 30000 });
    }

    async searchEmployeeForAttachment(partialEmployeeName: string, employeeName: string): Promise<void>{
        await expect(this.page).toHaveURL(/pim\/employees/i);
        await expect(this.attachmentEmployeeTable).toBeVisible();
        await this.attachmentEmployeeNameSearch.pressSequentially(partialEmployeeName);
        const employeeSuggestion = this.attachmentAutocompleteSuggestions
            .filter({ hasText: employeeName })
            .first();
        await expect(employeeSuggestion).toBeVisible();
        await employeeSuggestion.click({ noWaitAfter: true });
        await this.attachmentQuickSearchButton.click({ noWaitAfter: true });

        const employeeRow = this.attachmentEmployeeRows
            .filter({ hasText: employeeName })
            .first();
        await expect(employeeRow).toBeVisible();
    }

    async openEmployeeProfileForAttachment(employeeName: string): Promise<void>{
        const employeeRow = this.attachmentEmployeeRows
            .filter({ hasText: employeeName })
            .first();
        await employeeRow.getByText(employeeName, { exact: true }).click({ noWaitAfter: true });
    }

    async captureInitialEmployeeResultCount(): Promise<number>{
        await expect(this.page).toHaveURL(/pim\/employees/i);
        console.log('Step 2.2: Verify the Employee List and result table are displayed');
        await expect(this.employeeTable).toBeVisible();
        await expect(this.employeeRows.first()).toBeVisible();
        const initialEmployeeResultCount = await this.employeeRows.count();
        expect(initialEmployeeResultCount).toBeGreaterThan(0);
        console.log('Step 2.3: Store the initial visible result count:', initialEmployeeResultCount);
        return initialEmployeeResultCount;
    }

    async searchEmployeeByNameAndCaptureId(partialEmployeeName: string, expectedEmployeeName: string): Promise<string>{
        console.log('Step 3.1: Enter part of the employee name:', partialEmployeeName);
        await expect(this.employeeNameSearch).toBeVisible();
        await this.employeeNameSearch.pressSequentially(partialEmployeeName);
        await expect(this.employeeNameSearch).toHaveValue(partialEmployeeName);

        console.log('Step 3.2: Wait for autocomplete suggestions and capture their text');
        await expect(this.expectedEmployeeSuggestion(expectedEmployeeName)).toBeVisible();
        const autocompleteSuggestionTexts = await this.autocompleteSuggestions.allTextContents();
        expect(autocompleteSuggestionTexts.length).toBeGreaterThan(0);
        console.log('Step 3.3: Verify every suggestion contains the typed name');
        for (const suggestionText of autocompleteSuggestionTexts) {
            expect(suggestionText.toLowerCase()).toContain(partialEmployeeName.toLowerCase());
        }
        console.log('Captured autocomplete suggestions:', autocompleteSuggestionTexts.join(', '));

        console.log('Step 3.4: Select the expected employee suggestion');
        await this.expectedEmployeeSuggestion(expectedEmployeeName).click({ noWaitAfter: true });

        console.log('Step 3.5: Click Search and verify the selected employee appears');
        await this.quickSearchButton.click({ noWaitAfter: true });
        await expect(this.selectedEmployeeRow(expectedEmployeeName)).toBeVisible();
        let employeeId = (await this.selectedEmployeeId(expectedEmployeeName).innerText()).trim();
        expect(employeeId.length).toBeGreaterThan(0);
        console.log('Step 3.6: Capture the selected employee ID:', employeeId, 'for', expectedEmployeeName);
        return employeeId;
    }

    async clearEmployeeNameAndVerifyResults(emptyValue: string, initialEmployeeResultCount: number): Promise<void>{
        console.log('Step 4.1: Clear the employee name search');
        await this.employeeNameSearch.fill(emptyValue);
        await expect(this.employeeNameSearch).toHaveValue(emptyValue);
        console.log('Step 4.2: Search again and verify the initial result count returns');
        await this.quickSearchButton.click({ noWaitAfter: true });
        await expect(this.employeeRows).toHaveCount(initialEmployeeResultCount);
    }

    async filterByEmployeeIdAndVerify(employeeId: string, expectedEmployeeName: string): Promise<void>{
        console.log('Step 5.1: Open the filter panel for an Employee ID search');

        await this.filterButton.click({ noWaitAfter: true });
        await expect(this.filterHeading).toBeVisible();
        if (await this.makeFilterDefault.isChecked()) {
            console.log('Turn off Make Filter Default to avoid saving this filter');
            await this.makeFilterDefaultLabel.click();
        }
        console.log('Step 5.2: Enter the captured Employee ID:', employeeId);
        await this.employeeIdFilter.fill(employeeId);
        await expect(this.employeeIdFilter).toHaveValue(employeeId);
        console.log('Step 5.3: Search by Employee ID and verify the same employee is returned');
        await this.filterSearchButton.click({ noWaitAfter: true });
        await expect(this.selectedEmployeeRow(expectedEmployeeName)).toBeVisible();
        await expect(this.selectedEmployeeId(expectedEmployeeName)).toHaveText(employeeId);
    }

    async resetEmployeeIdFilterAndVerify(emptyValue: string, initialEmployeeResultCount: number): Promise<void>{
        console.log('Step 6.1: Reopen the filter panel and reset the Employee ID filter');
        await this.filterButton.click({ noWaitAfter: true });
        await expect(this.filterHeading).toBeVisible();
        await this.resetButton.click({ noWaitAfter: true });
        await expect(this.employeeIdFilter).toHaveValue(emptyValue);
        if (await this.filterHeading.isVisible()) {
            console.log('Apply the reset filters to reload the employee list');
            await this.filterSearchButton.click({ noWaitAfter: true });
        }
        await expect(this.employeeRows).toHaveCount(initialEmployeeResultCount);
        console.log('Step 6.2: Verify the broader Employee List has returned');
    }

    async filterByJobTitleAndVerify(expectedJobTitle: string): Promise<void>{
        console.log('Step 7.1: Open the filter panel and select Job Title:', expectedJobTitle);
        if (!(await this.filterHeading.isVisible())) {
            await this.filterButton.click({ noWaitAfter: true });
            await expect(this.filterHeading).toBeVisible();
        }
        if (await this.makeFilterDefault.isChecked()) {
            console.log('Turn off Make Filter Default to avoid saving this filter');
            await this.makeFilterDefaultLabel.click();
        }
        await this.jobTitleDropdown.click();
        await expect(this.jobTitleOption(expectedJobTitle)).toBeVisible();
        await this.jobTitleOption(expectedJobTitle).click();
        await expect(this.jobTitleDropdown).toHaveValue(expectedJobTitle);
        console.log('Step 7.2: Search using the selected Job Title');
        await this.filterSearchButton.click({ noWaitAfter: true });

        console.log('Step 7.3: Capture and verify the Job Title on every returned row');
        await expect(this.nonMatchingJobTitleCells(expectedJobTitle)).toHaveCount(0);
        const visibleJobTitles = await this.jobTitleCells.allTextContents();
        expect(visibleJobTitles.length).toBeGreaterThan(0);
        for (const visibleJobTitle of visibleJobTitles) {
            expect(visibleJobTitle.trim()).toBe(expectedJobTitle);
        }
        console.log('Verified Job Title for', visibleJobTitles.length, 'result row(s):', expectedJobTitle);
    }

    async addLocationFilterAndVerify(expectedJobTitle: string, expectedLocation: string, expectedEmployeeName: string): Promise<void>{
        console.log('Step 8.1: Add the Location filter:', expectedLocation);
        if (!(await this.filterHeading.isVisible())) {
            await this.filterButton.click({ noWaitAfter: true });
            await expect(this.filterHeading).toBeVisible();
        }
        await this.locationDropdown.click();
        await expect(this.locationOption(expectedLocation)).toBeVisible();
        await this.locationOption(expectedLocation).click();
        await expect(this.locationDropdown).toHaveValue(new RegExp(`${expectedLocation}$`));
        console.log('Step 8.2: Search using both Job Title and Location');
        await this.filterSearchButton.click({ noWaitAfter: true });

        console.log('Step 8.3: Verify every combined result matches both filters');
        await expect(this.nonMatchingJobTitleCells(expectedJobTitle)).toHaveCount(0);
        await expect(this.nonMatchingLocationCells(expectedLocation)).toHaveCount(0);
        await expect(this.selectedEmployeeRow(expectedEmployeeName)).toBeVisible();
        const combinedResultCount = await this.employeeRows.count();
        expect(combinedResultCount).toBeGreaterThan(0);
        const combinedJobTitles = await this.jobTitleCells.allTextContents();
        const combinedLocations = await this.locationCells.allTextContents();
        for (let rowIndex = 0; rowIndex < combinedResultCount; rowIndex++) {
            expect(combinedJobTitles[rowIndex].trim()).toBe(expectedJobTitle);
            expect(combinedLocations[rowIndex].trim()).toBe(expectedLocation);
            console.log('Verified row', rowIndex + 1, '- Job Title:', combinedJobTitles[rowIndex].trim(), '- Location:', combinedLocations[rowIndex].trim());
        }
    }

    async resetJobTitleAndLocationFiltersAndVerify(emptyValue: string, allStatus: string, initialEmployeeResultCount: number, expectedEmployeeName: string): Promise<void>{
        console.log('Step 9.1: Reset the Job Title and Location filters');
        if (!(await this.filterHeading.isVisible())) {
            await this.filterButton.click({ noWaitAfter: true });
            await expect(this.filterHeading).toBeVisible();
        }
        await this.resetButton.click({ noWaitAfter: true });
        await expect(this.employeeIdFilter).toHaveValue(emptyValue);
        await expect(this.jobTitleDropdown).toHaveValue(allStatus);
        await expect(this.locationDropdown).toHaveValue(allStatus);
        console.log('Step 9.2: Apply the reset and verify the initial list is restored');
        if (await this.filterHeading.isVisible()) {
            await this.filterSearchButton.click({ noWaitAfter: true });
        }
        await expect(this.employeeRows).toHaveCount(initialEmployeeResultCount);
        await expect(this.selectedEmployeeRow(expectedEmployeeName)).toBeVisible();
        console.log('Employee List restored. Visible row count:', initialEmployeeResultCount);
    }
}
