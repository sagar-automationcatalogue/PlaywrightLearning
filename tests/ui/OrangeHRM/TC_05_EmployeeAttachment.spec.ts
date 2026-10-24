import { test } from '@playwright/test';
import { TC_05_EmployeeAttachment } from '../../../test-data/orangeHRM';
import * as path from 'node:path';
import { OrangeHRM_LoginPage } from '../../../src/pages/OrangeHRM_LoginPage';
import { OrangeHRM_HomePage } from '../../../src/pages/OrangeHRM_HomePage';
import { OrangeHRM_EmployeeManagement } from '../../../src/pages/OrangeHRM_EmployeeManagement';
import { OrangeHRM_EmployeeProfile } from '../../../src/pages/OrangeHRM_EmployeeProfile';

test('@regression TC_05_EmployeeAttachment - Upload, download and delete employee attachment', async ({ page }) => {
  const pdfFilePath = path.resolve(
    process.cwd(),
    'test-data', 'pdfs',
    TC_05_EmployeeAttachment.fileName
  );
  const downloadedFilePath = path.resolve(process.cwd(), 'test-results', 'downloads', TC_05_EmployeeAttachment.fileName);
  const loginPage = new OrangeHRM_LoginPage(page);
  const homePage = new OrangeHRM_HomePage(page);
  const employeeManagementPage = new OrangeHRM_EmployeeManagement(page);
  const employeeProfilePage = new OrangeHRM_EmployeeProfile(page);

  console.log('Step 1: Open OrangeHRM and log in as Admin');
  await loginPage.openLoginPage();
  await loginPage.loginWithCredentials(
    TC_05_EmployeeAttachment.adminUsername,
    TC_05_EmployeeAttachment.adminPassword
  );
  await homePage.verifyEmployeeManagementVisible();
  console.log('Admin is authenticated');

  console.log('Step 2: Open Employee List and search for', TC_05_EmployeeAttachment.employeeName);
  await homePage.clickEmployeeManagement(true);
  await employeeManagementPage.searchEmployeeForAttachment(
    TC_05_EmployeeAttachment.partialEmployeeName,
    TC_05_EmployeeAttachment.employeeName
  );
  console.log('Target employee appears in the Employee List');

  console.log('Step 3: Open the employee profile and Personal Details');
  await employeeManagementPage.openEmployeeProfileForAttachment(TC_05_EmployeeAttachment.employeeName);
  await employeeProfilePage.openPersonalDetailsForAttachment(TC_05_EmployeeAttachment.employeeName);
  console.log('Personal Details opened for', TC_05_EmployeeAttachment.employeeName);

  console.log('Step 4: Find Attachments on the Personal Details page');
  const attachmentCounts = await employeeProfilePage.uploadAttachment(
    TC_05_EmployeeAttachment.fileName,
    TC_05_EmployeeAttachment.description,
    TC_05_EmployeeAttachment.noDataMessage,
    pdfFilePath,
    TC_05_EmployeeAttachment.uploadSuccessPattern
  );

  console.log('Step 5: Download the attachment using its filename row');
  await employeeProfilePage.downloadAttachment(
    TC_05_EmployeeAttachment.fileName,
    downloadedFilePath
  );
  console.log('Downloaded file exists:', downloadedFilePath);

  console.log('Step 6: Select the uploaded attachment and delete it from the Attachments menu');
  await employeeProfilePage.deleteAttachment(
    TC_05_EmployeeAttachment.fileName,
    TC_05_EmployeeAttachment.noDataMessage,
    attachmentCounts,
    TC_05_EmployeeAttachment.deleteSuccessPattern
  );
  console.log('Attachment was deleted and the original attachment count was restored');
  console.log('TC_05_EmployeeAttachment completed successfully');
});
