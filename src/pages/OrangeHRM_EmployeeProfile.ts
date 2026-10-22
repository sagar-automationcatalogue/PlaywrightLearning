import { Page, Locator, expect } from "@playwright/test";
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { TC_05_EmployeeAttachment } from '../../test-data/orangeHRM';

export class OrangeHRM_EmployeeProfile{
    page: Page;
    private personalDetailsTab: Locator;
    private personalDetailsHeading: Locator;
    private firstNameInput: Locator;
    private genderSelect: Locator;
    private maritalStatusSelect: Locator;
    private nationalitySelect: Locator;
    private birthdayInput: Locator;
    private saveButtons: Locator;
    private pageBody: Locator;
    private contactDetailsTab: Locator;
    private streetAddressInput: Locator;
    private cityInput: Locator;
    private stateInput: Locator;
    private zipInput: Locator;
    private mobileInput: Locator;
    private jobTab: Locator;
    private employeeNameText: (employeeName: string) => Locator;
    private attachmentsHeading: Locator;
    private attachmentTable: Locator;
    private fileInput: Locator;
    private addAttachmentButton: Locator;
    private descriptionField: Locator;
    private saveAttachmentButton: Locator;
    private attachmentsMenuButton: Locator;
    private deleteSelectedOption: Locator;
    private confirmDeleteButton: Locator;
    private attachmentRows: Locator;

    constructor(page: Page){
        this.page = page;
        this.personalDetailsTab = page.getByRole('link', { name: 'Personal Details' }).first();
        this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
        this.firstNameInput = page.locator('#firstName');
        this.genderSelect = page.locator('#emp_gender');
        this.maritalStatusSelect = page.locator('#emp_marital_status');
        this.nationalitySelect = page.locator('#nation_code');
        this.birthdayInput = page.locator('#emp_birthday');
        this.saveButtons = page.getByRole('button', { name: 'Save' });
        this.pageBody = page.locator('body');
        this.contactDetailsTab = page.getByRole('link', { name: 'Contact Details' }).first();
        this.streetAddressInput = page.locator('#street1');
        this.cityInput = page.locator('#city');
        this.stateInput = page.locator('#province');
        this.zipInput = page.locator('#emp_zipcode');
        this.mobileInput = page.locator('#emp_mobile');
        this.jobTab = page.getByRole('link', { name: 'Job' }).first();
        this.employeeNameText = (employeeName: string) => page.getByText(employeeName, { exact: true }).first();
        this.attachmentsHeading = page.getByText(/Attachments/i).last();
        this.attachmentTable = page.locator('table:visible')
            .filter({ has: page.getByText('File Name', { exact: true }) })
            .first();
        this.fileInput = page.locator('input[type="file"]');
        this.addAttachmentButton = page.getByText('Add', { exact: true }).last();
        this.descriptionField = page.locator('textarea').first();
        this.saveAttachmentButton = page.locator('#modal-save-button');
        this.attachmentsMenuButton = page.getByText('more_horiz', { exact: true });
        this.deleteSelectedOption = page.getByText(/delete selected/i);
        this.confirmDeleteButton = page.getByRole('button', { name: /Yes, Delete|Confirm/i });
        this.attachmentRows = this.attachmentTable.locator('tbody tr:visible')
            .filter({ hasNotText: TC_05_EmployeeAttachment.noDataMessage });
    }

    async openPersonalDetailsForAttachment(employeeName: string): Promise<void>{
        await expect(this.personalDetailsTab).toBeVisible();
        await this.personalDetailsTab.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.personalDetailsHeading).toBeVisible();
        await expect(this.firstNameInput).toBeVisible();
        await expect(this.employeeNameText(employeeName)).toBeVisible();
    }

    async uploadAttachment(
        fileName: string,
        description: string,
        noDataMessage: string,
        pdfFilePath: string,
        uploadSuccessPattern: RegExp
    ): Promise<{ baselineAttachmentCount: number; baselineMatchingAttachmentCount: number }>{
        await expect(this.attachmentsHeading).toBeVisible();
        await this.page.waitForLoadState('networkidle');
        await this.page.locator('body').press('End');
        await this.attachmentsHeading.scrollIntoViewIfNeeded();
        await expect(this.attachmentsHeading).toBeInViewport();

        const attachmentRows = this.attachmentTable.locator('tbody tr:visible')
            .filter({ hasNotText: noDataMessage });
        const baselineAttachmentCount = await attachmentRows.count();
        const baselineMatchingAttachmentCount = await attachmentRows.filter({ hasText: fileName }).count();
        console.log('Attachments section is visible. Baseline attachment count:', baselineAttachmentCount);
        await this.attachmentTable.scrollIntoViewIfNeeded();
        await expect(this.attachmentTable).toBeInViewport();

        if (await this.fileInput.count() === 0) {
            await expect(this.addAttachmentButton).toBeAttached();
            await this.addAttachmentButton.scrollIntoViewIfNeeded();
            await expect(this.addAttachmentButton).toBeInViewport();
            await this.addAttachmentButton.click();
        }
        await expect(this.fileInput).toBeAttached();
        await this.fileInput.setInputFiles(pdfFilePath);
        await expect(this.fileInput).toHaveValue(new RegExp(fileName.replace(/\./g, '\\.'), 'i'));
        console.log('Selected the requested PDF:', fileName);

        if (await this.descriptionField.count()) {
            await this.descriptionField.fill(description);
            await expect(this.descriptionField).toHaveValue(description);
            console.log('Attachment description entered');
        }

        await this.saveAttachmentButton.click();
        const uploadedAttachmentRow = attachmentRows.filter({ hasText: fileName }).first();
        await expect(uploadedAttachmentRow).toBeVisible();
        await expect(this.pageBody).toContainText(uploadSuccessPattern);
        await expect(attachmentRows).toHaveCount(baselineAttachmentCount + 1);
        console.log('Upload succeeded; attachment count increased by one');

        return { baselineAttachmentCount, baselineMatchingAttachmentCount };
    }

    async downloadAttachment(fileName: string, downloadedFilePath: string): Promise<void>{
        const uploadedAttachmentRow = this.attachmentRows.filter({ hasText: fileName }).first();
        await uploadedAttachmentRow.scrollIntoViewIfNeeded();
        await expect(uploadedAttachmentRow).toBeInViewport();
        const downloadButton = uploadedAttachmentRow.locator('.material-icons').filter({ hasText: /download/i });
        await expect(downloadButton).toBeVisible();
        await fs.mkdir(path.dirname(downloadedFilePath), { recursive: true });
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            downloadButton.click(),
        ]);
        expect(download.suggestedFilename()).toContain(fileName);
        await download.saveAs(downloadedFilePath);
        const downloadedFile = await fs.stat(downloadedFilePath);
        expect(downloadedFile.isFile()).toBe(true);
        expect(downloadedFile.size).toBeGreaterThan(0);
    }

    async deleteAttachment(
        fileName: string,
        noDataMessage: string,
        attachmentCounts: { baselineAttachmentCount: number; baselineMatchingAttachmentCount: number },
        deleteSuccessPattern: RegExp
    ): Promise<void>{
        const attachmentRows = this.attachmentTable.locator('tbody tr:visible')
            .filter({ hasNotText: noDataMessage });
        const uploadedAttachmentRow = attachmentRows.filter({ hasText: fileName }).first();
        await expect(uploadedAttachmentRow).toBeVisible();
        const attachmentRowCheckbox = uploadedAttachmentRow.locator('input[type="checkbox"]');
        const attachmentRowCheckboxLabel = uploadedAttachmentRow.locator('label[for^="checkbox_attachments_"]');
        await expect(attachmentRowCheckbox).toBeAttached();
        await expect(attachmentRowCheckboxLabel).toBeVisible();
        await attachmentRowCheckboxLabel.click();
        await expect(attachmentRowCheckbox).toBeChecked();
        console.log('Selected the uploaded attachment row');

        await expect(this.attachmentsMenuButton).toBeVisible();
        await this.attachmentsMenuButton.click();
        await expect(this.deleteSelectedOption).toBeVisible();
        await this.deleteSelectedOption.click();

        if (await this.confirmDeleteButton.isVisible()) {
            await this.confirmDeleteButton.click();
        }
        await expect(attachmentRows.filter({ hasText: fileName }))
            .toHaveCount(attachmentCounts.baselineMatchingAttachmentCount);
        await expect(attachmentRows).toHaveCount(attachmentCounts.baselineAttachmentCount);
        await expect(this.pageBody).toContainText(deleteSuccessPattern);
    }

    async openPersonalDetailsAndLogCurrentValues(): Promise<void>{
        await this.personalDetailsTab.click();
        await expect(this.personalDetailsHeading).toBeVisible({ timeout: 30000 });
        await expect(this.firstNameInput).toBeVisible({ timeout: 30000 });

        const previousGender = await this.genderSelect.inputValue();
        const previousMaritalStatus = await this.maritalStatusSelect.inputValue();
        const previousNationality = await this.nationalitySelect.inputValue();
        const previousBirthday = await this.birthdayInput.inputValue();

        console.log('Previous gender:', previousGender);
        console.log('Previous marital status:', previousMaritalStatus);
        console.log('Previous nationality:', previousNationality);
        console.log('Previous birthday:', previousBirthday);
    }

    async updatePersonalDetails(
        genderValue: string,
        maritalStatusValue: string,
        nationalityValue: string,
        birthday: string
    ): Promise<void>{
        await this.genderSelect.evaluate((element, value) => {
            (element as HTMLSelectElement).value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }, genderValue);

        await this.maritalStatusSelect.evaluate((element, value) => {
            (element as HTMLSelectElement).value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }, maritalStatusValue);

        await this.nationalitySelect.evaluate((element, value) => {
            (element as HTMLSelectElement).value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }, nationalityValue);

        await this.birthdayInput.click();
        await this.birthdayInput.fill(birthday);

        await this.saveButtons.first().click();
        await expect(this.pageBody).toContainText(/success|saved/i, { timeout: 30000 });
    }

    async reloadAndVerifyPersonalDetails(birthday: string): Promise<void>{
        await this.page.reload();
        await expect(this.personalDetailsHeading).toBeVisible({ timeout: 30000 });
        await this.personalDetailsTab.click();

        await expect(this.genderSelect).toHaveValue(/string:/, { timeout: 20000 });
        await expect(this.maritalStatusSelect).toHaveValue(/string:/, { timeout: 20000 });
        await expect(this.nationalitySelect).toHaveValue(/string:/, { timeout: 20000 });
        await expect(this.birthdayInput).toHaveValue(birthday, { timeout: 20000 });
    }

    async updateContactDetails(
        streetAddress: string,
        city: string,
        state: string,
        zip: string,
        mobile: string
    ): Promise<void>{
        await this.contactDetailsTab.click();
        await expect(this.streetAddressInput).toBeVisible({ timeout: 30000 });

        await this.streetAddressInput.fill(streetAddress);
        await this.cityInput.fill(city);
        await this.stateInput.fill(state);
        await this.zipInput.fill(zip);
        await this.mobileInput.fill(mobile);

        await this.saveButtons.last().click();
        await expect(this.pageBody).toContainText(/success|saved/i, { timeout: 30000 });
    }

    async openJobThenContactDetails(): Promise<void>{
        await this.jobTab.click();
        await this.contactDetailsTab.click();
    }

    async verifyContactDetailsPersisted(
        streetAddress: string,
        city: string,
        state: string,
        zip: string,
        mobile: string
    ): Promise<void>{
        await expect(this.streetAddressInput).toHaveValue(streetAddress, { timeout: 20000 });
        await expect(this.cityInput).toHaveValue(city, { timeout: 20000 });
        await expect(this.stateInput).toHaveValue(state, { timeout: 20000 });
        await expect(this.zipInput).toHaveValue(zip, { timeout: 20000 });
        await expect(this.mobileInput).toHaveValue(mobile, { timeout: 20000 });
    }
}
