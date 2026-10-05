import { test, expect } from '@playwright/test';

test('TC_02_EmployeeSearch - Search and filter employee records', async ({ page }) => {
	const applicationUrl = 'https://automaetesting-trials821.orangehrmlive.com/';
	const adminUsername = 'admin';
	const adminPassword = 'Admin@123';
	const partialEmployeeName = 'Mazie';
	const expectedEmployeeName = 'Mazie Abraham';
	const expectedJobTitle = 'Marketing Executive';
	const expectedLocation = 'Sydney Hub';

	console.log('Step 1.1: Open the OrangeHRM application:', applicationUrl);
	await page.goto(applicationUrl, { waitUntil: 'domcontentloaded' });
	console.log('Step 1.2: Verify the login form is displayed');
	await expect(page.getByPlaceholder('Username')).toBeVisible();
	console.log('Step 1.3: Enter the Admin username and password');
	await page.getByPlaceholder('Username').fill(adminUsername);
	await page.getByPlaceholder('Password').fill(adminPassword);
	console.log('Step 1.4: Submit the login form');
	await page.getByRole('button', { name: 'Login' }).click({ noWaitAfter: true });
	const employeeManagementLink = page.getByRole('link', { name: 'Employee Management', exact: true });
	await expect(employeeManagementLink).toBeVisible();
	console.log('Step 1.5: Confirm Admin is authenticated');

	console.log('Step 2.1: Open the Employee Management module');
	await employeeManagementLink.click({ noWaitAfter: true });
	await expect(page).toHaveURL(/pim\/employees/i);

	const employeeTable = page.locator('#employeeListTable');
	const employeeRows = page.locator('#employeeListTable tbody tr');
	console.log('Step 2.2: Verify the Employee List and result table are displayed');
	await expect(employeeTable).toBeVisible();
	await expect(employeeRows.first()).toBeVisible();
	const initialEmployeeResultCount = await employeeRows.count();
	expect(initialEmployeeResultCount).toBeGreaterThan(0);
	console.log('Step 2.3: Store the initial visible result count:', initialEmployeeResultCount);

	console.log('Step 3.1: Enter part of the employee name:', partialEmployeeName);
	const employeeNameSearch = page.locator('#employee_name_quick_filter_employee_list_value');
	await expect(employeeNameSearch).toBeVisible();
	await employeeNameSearch.pressSequentially(partialEmployeeName);
	await expect(employeeNameSearch).toHaveValue(partialEmployeeName);

	console.log('Step 3.2: Wait for autocomplete suggestions and capture their text');
	const autocompleteSuggestions = page.locator('#employee_name_quick_filter_employee_list_dropdown .angucomplete-row');
	const expectedEmployeeSuggestion = autocompleteSuggestions.filter({ hasText: /Mazie\s+Abraham/ }).first();
	await expect(expectedEmployeeSuggestion).toBeVisible();
	const autocompleteSuggestionTexts = await autocompleteSuggestions.allTextContents();
	expect(autocompleteSuggestionTexts.length).toBeGreaterThan(0);
	console.log('Step 3.3: Verify every suggestion contains the typed name');
	for (const suggestionText of autocompleteSuggestionTexts) {
		expect(suggestionText.toLowerCase()).toContain(partialEmployeeName.toLowerCase());
	}
	console.log('Captured autocomplete suggestions:', autocompleteSuggestionTexts.join(', '));

	console.log('Step 3.4: Select the expected employee suggestion');
	await expectedEmployeeSuggestion.click({ noWaitAfter: true });

	const quickSearchButton = page.locator('.employee-navbar-button').first();
	console.log('Step 3.5: Click Search and verify the selected employee appears');
	await quickSearchButton.click({ noWaitAfter: true });
	const selectedEmployeeRow = employeeRows.filter({ hasText: /Mazie\s+Abraham/ }).first();
	await expect(selectedEmployeeRow).toBeVisible();
	let employeeId = (await selectedEmployeeRow.locator('td').nth(1).innerText()).trim();
	expect(employeeId.length).toBeGreaterThan(0);
	console.log('Step 3.6: Capture the selected employee ID:', employeeId, 'for', expectedEmployeeName);

	console.log('Step 4.1: Clear the employee name search');
	await employeeNameSearch.fill('');
	await expect(employeeNameSearch).toHaveValue('');
	console.log('Step 4.2: Search again and verify the initial result count returns');
	await quickSearchButton.click({ noWaitAfter: true });
	await expect(employeeRows).toHaveCount(initialEmployeeResultCount);

	console.log('Step 5.1: Open the filter panel for an Employee ID search');
	const filterButton = page.locator('.employee-navbar-button').nth(1);
	const filterHeading = page.getByRole('heading', { name: 'Filter Employees By' });
	const filterSearchButton = page.getByRole('link', { name: 'Search', exact: true }).last();
	const resetButton = page.getByRole('link', { name: 'Reset', exact: true }).last();
	const employeeIdFilter = page.locator('#emp_search_mdl_employee_id_filter');
	const makeFilterDefault = page.locator('#emp_search_mdl_persist_filters_as_default');

	await filterButton.click({ noWaitAfter: true });
	await expect(filterHeading).toBeVisible();
	if (await makeFilterDefault.isChecked()) {
		console.log('Turn off Make Filter Default to avoid saving this filter');
		await page.getByText('Make Filter Default', { exact: true }).click();
	}
	console.log('Step 5.2: Enter the captured Employee ID:', employeeId);
	await employeeIdFilter.fill(employeeId);
	await expect(employeeIdFilter).toHaveValue(employeeId);
	console.log('Step 5.3: Search by Employee ID and verify the same employee is returned');
	await filterSearchButton.click({ noWaitAfter: true });
	await expect(selectedEmployeeRow).toBeVisible();
	await expect(selectedEmployeeRow.locator('td').nth(1)).toHaveText(employeeId);

	console.log('Step 6.1: Reopen the filter panel and reset the Employee ID filter');
	await filterButton.click({ noWaitAfter: true });
	await expect(filterHeading).toBeVisible();
	await resetButton.click({ noWaitAfter: true });
	await expect(employeeIdFilter).toHaveValue('');
	if (await filterHeading.isVisible()) {
		console.log('Apply the reset filters to reload the employee list');
		await filterSearchButton.click({ noWaitAfter: true });
	}
	await expect(employeeRows).toHaveCount(initialEmployeeResultCount);
	console.log('Step 6.2: Verify the broader Employee List has returned');

	console.log('Step 7.1: Open the filter panel and select Job Title:', expectedJobTitle);
	if (!(await filterHeading.isVisible())) {
		await filterButton.click({ noWaitAfter: true });
		await expect(filterHeading).toBeVisible();
	}
	if (await makeFilterDefault.isChecked()) {
		console.log('Turn off Make Filter Default to avoid saving this filter');
		await page.getByText('Make Filter Default', { exact: true }).click();
	}
	const jobTitleDropdown = page.locator('input.select-dropdown').nth(2);
	await jobTitleDropdown.click();
	const jobTitleOption = page.locator('.dropdown-content:visible').getByText(expectedJobTitle, { exact: true });
	await expect(jobTitleOption).toBeVisible();
	await jobTitleOption.click();
	await expect(jobTitleDropdown).toHaveValue(expectedJobTitle);
	console.log('Step 7.2: Search using the selected Job Title');
	await filterSearchButton.click({ noWaitAfter: true });

	console.log('Step 7.3: Capture and verify the Job Title on every returned row');
	const jobTitleCells = employeeRows.locator('td:nth-child(4)');
	await expect(jobTitleCells.filter({ hasNotText: expectedJobTitle })).toHaveCount(0);
	const visibleJobTitles = await jobTitleCells.allTextContents();
	expect(visibleJobTitles.length).toBeGreaterThan(0);
	for (const visibleJobTitle of visibleJobTitles) {
		expect(visibleJobTitle.trim()).toBe(expectedJobTitle);
	}
	console.log('Verified Job Title for', visibleJobTitles.length, 'result row(s):', expectedJobTitle);

	console.log('Step 8.1: Add the Location filter:', expectedLocation);
	if (!(await filterHeading.isVisible())) {
		await filterButton.click({ noWaitAfter: true });
		await expect(filterHeading).toBeVisible();
	}
	const locationDropdown = page.locator('input.select-dropdown').nth(5);
	await locationDropdown.click();
	const locationOption = page.locator('.dropdown-content:visible').getByText(expectedLocation, { exact: true });
	await expect(locationOption).toBeVisible();
	await locationOption.click();
	await expect(locationDropdown).toHaveValue(/Sydney Hub$/);
	console.log('Step 8.2: Search using both Job Title and Location');
	await filterSearchButton.click({ noWaitAfter: true });

	console.log('Step 8.3: Verify every combined result matches both filters');
	const combinedJobTitleCells = employeeRows.locator('td:nth-child(4)');
	const combinedLocationCells = employeeRows.locator('td:nth-child(8)');
	await expect(combinedJobTitleCells.filter({ hasNotText: expectedJobTitle })).toHaveCount(0);
	await expect(combinedLocationCells.filter({ hasNotText: expectedLocation })).toHaveCount(0);
	await expect(selectedEmployeeRow).toBeVisible();
	const combinedResultCount = await employeeRows.count();
	expect(combinedResultCount).toBeGreaterThan(0);
	const combinedJobTitles = await combinedJobTitleCells.allTextContents();
	const combinedLocations = await combinedLocationCells.allTextContents();
	for (let rowIndex = 0; rowIndex < combinedResultCount; rowIndex++) {
		expect(combinedJobTitles[rowIndex].trim()).toBe(expectedJobTitle);
		expect(combinedLocations[rowIndex].trim()).toBe(expectedLocation);
		console.log('Verified row', rowIndex + 1, '- Job Title:', combinedJobTitles[rowIndex].trim(), '- Location:', combinedLocations[rowIndex].trim());
	}

	console.log('Step 9.1: Reset the Job Title and Location filters');
	if (!(await filterHeading.isVisible())) {
		await filterButton.click({ noWaitAfter: true });
		await expect(filterHeading).toBeVisible();
	}
	await resetButton.click({ noWaitAfter: true });
	await expect(employeeIdFilter).toHaveValue('');
	await expect(jobTitleDropdown).toHaveValue('All');
	await expect(locationDropdown).toHaveValue('All');
	console.log('Step 9.2: Apply the reset and verify the initial list is restored');
	if (await filterHeading.isVisible()) {
		await filterSearchButton.click({ noWaitAfter: true });
	}
	await expect(employeeRows).toHaveCount(initialEmployeeResultCount);
	await expect(employeeRows.filter({ hasText: /Mazie\s+Abraham/ }).first()).toBeVisible();
	console.log('Employee List restored. Visible row count:', initialEmployeeResultCount);
});