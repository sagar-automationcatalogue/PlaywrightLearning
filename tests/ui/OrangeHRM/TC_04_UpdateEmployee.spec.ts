import { test } from '@playwright/test';
import { TC_04_UpdateEmployee } from '../../../test-data/orangeHRM';
import { OrangeHRM_LoginPage } from '../../../src/pages/OrangeHRM_LoginPage';
import { OrangeHRM_HomePage } from '../../../src/pages/OrangeHRM_HomePage';
import { OrangeHRM_EmployeeManagement } from '../../../src/pages/OrangeHRM_EmployeeManagement';
import { OrangeHRM_EmployeeProfile } from '../../../src/pages/OrangeHRM_EmployeeProfile';

test('@sanity TC_04_UpdateEmployee - Update employee personal and contact details', async ({ page }) => {
  test.setTimeout(180000);

  const loginPage = new OrangeHRM_LoginPage(page);
  const homePage = new OrangeHRM_HomePage(page);
  const employeeManagementPage = new OrangeHRM_EmployeeManagement(page);
  const employeeProfilePage = new OrangeHRM_EmployeeProfile(page);

  // Step 1: Open OrangeHRM login page
  await loginPage.openLoginPage();
  await loginPage.verifyLoginPageHeader();

  // Step 2: Login as Admin
  await loginPage.loginWithCredentials(TC_04_UpdateEmployee.adminUsername, TC_04_UpdateEmployee.adminPassword);
  await homePage.verifyDashboardLoaded();
  console.log('Admin login successful');

  // Step 3: Navigate to Employee List
  await homePage.clickEmployeeList();
  await employeeManagementPage.verifyEmployeeListOpened();
  console.log('Employee list page opened');

  // Step 4: Search and open the employee profile
  await employeeManagementPage.openEmployeeProfile(TC_04_UpdateEmployee.employeeName);
  console.log('Employee profile opened');

  // Step 5: Verify Personal Details tab and capture current values
  await employeeProfilePage.openPersonalDetailsAndLogCurrentValues();

  // Step 6: Update personal details
  await employeeProfilePage.updatePersonalDetails(
    TC_04_UpdateEmployee.genderValue,
    TC_04_UpdateEmployee.maritalStatusValue,
    TC_04_UpdateEmployee.nationalityValue,
    TC_04_UpdateEmployee.newBirthday
  );
  console.log('Personal details saved successfully');

  // Step 7: Refresh/reopen the profile and verify values persist
  await employeeProfilePage.reloadAndVerifyPersonalDetails(TC_04_UpdateEmployee.newBirthday);
  console.log('Personal details persisted after refresh');

  // Step 8: Navigate to Contact Details and update contact information
  await employeeProfilePage.updateContactDetails(
    TC_04_UpdateEmployee.newStreetAddress,
    TC_04_UpdateEmployee.newCity,
    TC_04_UpdateEmployee.newState,
    TC_04_UpdateEmployee.newZip,
    TC_04_UpdateEmployee.newMobile
  );
  console.log('Contact details saved successfully');

  // Step 9: Open another employee profile tab and return to Contact Details
  await employeeProfilePage.openJobThenContactDetails();

  // Step 10: Verify saved contact values remain
  await employeeProfilePage.verifyContactDetailsPersisted(
    TC_04_UpdateEmployee.newStreetAddress,
    TC_04_UpdateEmployee.newCity,
    TC_04_UpdateEmployee.newState,
    TC_04_UpdateEmployee.newZip,
    TC_04_UpdateEmployee.newMobile
  );
  console.log('Updated contact details persisted correctly');

  // Optional restore step
  console.log('Optional restore step can be added if required for the shared environment');
});