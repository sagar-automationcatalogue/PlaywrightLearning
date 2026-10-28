import { test } from '@playwright/test';
import { TC_02_EmployeeSearch } from '../../../test-data/orangeHRM';
import { OrangeHRM_LoginPage } from '../../../src/pages/OrangeHRM_LoginPage';
import { OrangeHRM_HomePage } from '../../../src/pages/OrangeHRM_HomePage';
import { OrangeHRM_EmployeeManagement } from '../../../src/pages/OrangeHRM_EmployeeManagement';
import { orangeHRMBaseURL } from '../../../src/config/EnvironmentConfig';
import { PlaywrightUtils } from '../../../src/utils/PlaywrightUtils';

test('@sanity TC_02_EmployeeSearch - Search and filter employee records', async ({ page }) => {
    const loginPage = new OrangeHRM_LoginPage(page);
    await PlaywrightUtils.navigateToURL(page, orangeHRMBaseURL);
    await loginPage.openLoginPage();
    await loginPage.verifyLoginFormVisible();
    await loginPage.loginWithCredentials(TC_02_EmployeeSearch.adminUsername, TC_02_EmployeeSearch.adminPassword);

    const homePage = new OrangeHRM_HomePage(page);
    await homePage.verifyEmployeeManagementVisible();
    await homePage.clickEmployeeManagement(true);

    const employeeManagementPage = new OrangeHRM_EmployeeManagement(page);
    const initialEmployeeResultCount = await employeeManagementPage.captureInitialEmployeeResultCount();
    const employeeId = await employeeManagementPage.searchEmployeeByNameAndCaptureId(
        TC_02_EmployeeSearch.partialEmployeeName, TC_02_EmployeeSearch.expectedEmployeeName
    );
    await employeeManagementPage.clearEmployeeNameAndVerifyResults(
        TC_02_EmployeeSearch.emptyValue, initialEmployeeResultCount
    );
    await employeeManagementPage.filterByEmployeeIdAndVerify(employeeId, TC_02_EmployeeSearch.expectedEmployeeName);
    await employeeManagementPage.resetEmployeeIdFilterAndVerify(
        TC_02_EmployeeSearch.emptyValue, initialEmployeeResultCount
    );
    await employeeManagementPage.filterByJobTitleAndVerify(TC_02_EmployeeSearch.expectedJobTitle);
    await employeeManagementPage.addLocationFilterAndVerify(
        TC_02_EmployeeSearch.expectedJobTitle, TC_02_EmployeeSearch.expectedLocation, TC_02_EmployeeSearch.expectedEmployeeName
    );
    await employeeManagementPage.resetJobTitleAndLocationFiltersAndVerify(
        TC_02_EmployeeSearch.emptyValue, TC_02_EmployeeSearch.allStatus,
        initialEmployeeResultCount, TC_02_EmployeeSearch.expectedEmployeeName
    );
});
