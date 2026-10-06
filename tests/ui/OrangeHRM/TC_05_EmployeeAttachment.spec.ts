import { test, expect } from '@playwright/test';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

test('@regression TC_05_EmployeeAttachment - Upload, download and delete employee attachment', async ({ page }) => {
  const applicationUrl = 'https://automaetesting-trials821.orangehrmlive.com/';
  const employeeName = 'Mazie Abraham';
  const fileName = 'Playwright-Cheat-Sheet.pdf';
  const pdfFilePath = path.resolve(
  process.cwd(),
  'PlaywrightLearning',
  'test-data',
  fileName
);
  const downloadedFilePath = path.resolve(process.cwd(), 'test-results', 'downloads', fileName);

  console.log('Step 1: Open OrangeHRM and log in as Admin');
  await page.goto(applicationUrl, { waitUntil: 'domcontentloaded' });
  const usernameField = page.getByPlaceholder('Username');
  const passwordField = page.getByPlaceholder('Password');
  await expect(usernameField).toBeVisible();
  await usernameField.fill('admin');
  await passwordField.fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click({ noWaitAfter: true });
  await expect(page.getByRole('link', { name: 'Employee Management', exact: true })).toBeVisible();
  console.log('Admin is authenticated');

  console.log('Step 2: Open Employee List and search for', employeeName);
  await page.getByRole('link', { name: 'Employee Management', exact: true }).click({ noWaitAfter: true });
  await expect(page).toHaveURL(/pim\/employees/i);
  await expect(page.locator('#employeeListTable')).toBeVisible();
  const employeeNameSearch = page.locator('#employee_name_quick_filter_employee_list_value');
  await employeeNameSearch.pressSequentially('Mazie');
  const employeeSuggestion = page.locator('#employee_name_quick_filter_employee_list_dropdown .angucomplete-row').filter({ hasText: employeeName }).first();
  await expect(employeeSuggestion).toBeVisible();
  await employeeSuggestion.click({ noWaitAfter: true });
  await page.locator('.employee-navbar-button').first().click({ noWaitAfter: true });
  const employeeRow = page.locator('#employeeListTable tbody tr').filter({ hasText: employeeName }).first();
  await expect(employeeRow).toBeVisible();
  console.log('Target employee appears in the Employee List');

  console.log('Step 3: Open the employee profile and Personal Details');
  await employeeRow.getByText(employeeName, { exact: true }).click({ noWaitAfter: true });
  await expect(page.getByRole('link', { name: 'Personal Details' }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Personal Details' }).first().click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
  await expect(page.locator('#firstName')).toBeVisible();
  await expect(page.getByText(employeeName, { exact: true }).first()).toBeVisible();
  console.log('Personal Details opened for', employeeName);

  console.log('Step 4: Find Attachments on the Personal Details page');
  const attachmentsHeading = page.getByText(/Attachments/i).last();
  await expect(attachmentsHeading).toBeVisible();
  await page.waitForLoadState('networkidle');
  await page.locator('body').press('End');
  await attachmentsHeading.scrollIntoViewIfNeeded();
  await expect(attachmentsHeading).toBeInViewport();
  const attachmentTable = page.locator('table:visible').filter({ has: page.getByText('File Name', { exact: true }) }).first();
  await attachmentTable.scrollIntoViewIfNeeded();
  const attachmentRows = attachmentTable.locator('tbody tr:visible').filter({ hasNotText: 'Sorry, No Data Found!' });
  const baselineAttachmentCount = await attachmentRows.count();
  const baselineMatchingAttachmentCount = await attachmentRows.filter({ hasText: fileName }).count();
  console.log('Attachments section is visible. Baseline attachment count:', baselineAttachmentCount);
  await attachmentTable.scrollIntoViewIfNeeded();
  await expect(attachmentTable).toBeInViewport();
  const fileInput = page.locator('input[type="file"]');
  if (await fileInput.count() === 0) {
    const addAttachmentButton = page.getByText('Add', { exact: true }).last();
    await expect(addAttachmentButton).toBeAttached();
    await addAttachmentButton.scrollIntoViewIfNeeded();
    await expect(addAttachmentButton).toBeInViewport();
    await addAttachmentButton.click();
  }
  await expect(fileInput).toBeAttached();
  await fileInput.setInputFiles(pdfFilePath);
  await expect(fileInput).toHaveValue(/Playwright-Cheat-Sheet\.pdf/i);
  console.log('Selected the requested PDF:', fileName);

  const descriptionField = page.locator('textarea').first();
  if (await descriptionField.count()) {
    await descriptionField.fill('Uploaded by Playwright automation');
    await expect(descriptionField).toHaveValue('Uploaded by Playwright automation');
    console.log('Attachment description entered');
  }

  console.log('Step 4: Save the attachment and verify it was added');
  await page.locator('#modal-save-button').click();
  const uploadedAttachmentRow = attachmentRows.filter({ hasText: fileName }).first();
  await expect(uploadedAttachmentRow).toBeVisible();
  await expect(page.locator('body')).toContainText(/success|saved|uploaded/i);
  await expect(attachmentRows).toHaveCount(baselineAttachmentCount + 1);
  console.log('Upload succeeded; attachment count increased by one');

  console.log('Step 5: Download the attachment using its filename row');
  await uploadedAttachmentRow.scrollIntoViewIfNeeded();
  await expect(uploadedAttachmentRow).toBeInViewport();
  const downloadButton = uploadedAttachmentRow.locator('.material-icons').filter({ hasText: /download/i });
  await expect(downloadButton).toBeVisible();
  await fs.mkdir(path.dirname(downloadedFilePath), { recursive: true });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    downloadButton.click(),
  ]);
  const suggestedFileName = download.suggestedFilename();
  expect(suggestedFileName).toContain(fileName);
  await download.saveAs(downloadedFilePath);
  const downloadedFile = await fs.stat(downloadedFilePath);
  expect(downloadedFile.isFile()).toBe(true);
  expect(downloadedFile.size).toBeGreaterThan(0);
  console.log('Downloaded file exists:', downloadedFilePath);

  console.log('Step 6: Select the uploaded attachment and delete it from the Attachments menu');
  await expect(uploadedAttachmentRow).toBeVisible();
  const attachmentRowCheckbox = uploadedAttachmentRow.locator('input[type="checkbox"]');
  const attachmentRowCheckboxLabel = uploadedAttachmentRow.locator('label[for^="checkbox_attachments_"]');
  await expect(attachmentRowCheckbox).toBeAttached();
  await expect(attachmentRowCheckboxLabel).toBeVisible();
  await attachmentRowCheckboxLabel.click();
  await expect(attachmentRowCheckbox).toBeChecked();
  console.log('Selected the uploaded attachment row');

  const attachmentsMenuButton = page.getByText('more_horiz', { exact: true });
  await expect(attachmentsMenuButton).toBeVisible();
  await attachmentsMenuButton.click();
  const deleteSelectedOption = page.getByText(/delete selected/i);
  await expect(deleteSelectedOption).toBeVisible();
  await deleteSelectedOption.click();

  const confirmDeleteButton = page.getByRole('button', { name: /Yes, Delete|Confirm/i });
  if (await confirmDeleteButton.isVisible()) {
    await confirmDeleteButton.click();
  }
  await expect(attachmentRows.filter({ hasText: fileName })).toHaveCount(baselineMatchingAttachmentCount);
  await expect(attachmentRows).toHaveCount(baselineAttachmentCount);
  await expect(page.locator('body')).toContainText(/success|deleted|removed/i);
  console.log('Attachment was deleted and the original attachment count was restored');
  console.log('TC_05_EmployeeAttachment completed successfully');
});






















