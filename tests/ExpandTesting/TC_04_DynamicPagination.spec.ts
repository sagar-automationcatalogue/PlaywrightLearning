import { expect, test } from '@playwright/test';

test('TC_04_DynamicPagination: Page Size, Search, Sorting, and Integrity', async ({ page }) => {
	const pageUrl = 'https://practice.expandtesting.com/dynamic-pagination-table';
	const searchKeyword = 'Female';

	// Steps 1-2: Open the table and verify its expected headers.
	await page.goto(pageUrl);
	await expect(page).toHaveURL(pageUrl);

	const pageSizeSelect = page.getByRole('combobox', { name: 'Show entries' });
	const searchInput = page.getByRole('searchbox', { name: 'Search:' });
	const table = page.getByRole('table');
	const tableHeaders = table.getByRole('columnheader');
	const tableRows = page.locator('table tbody tr');
	const studentNameHeader = page.getByRole('columnheader', { name: /Student Name/ });
	const defaultStudentNameSort = await studentNameHeader.getAttribute('aria-label');

	await expect(tableHeaders).toHaveText([
		'Student Name',
		'Gender',
		'Class Level',
		'Home State',
		'Major',
		'Extracurricular Activity'
	]);
	console.log('Dynamic pagination table and all expected headers are visible');

	// Steps 3-8: Capture the initial page, select three rows, and verify row structure.
	const initialVisibleRowCount = await tableRows.count();
	expect(initialVisibleRowCount).toBeGreaterThan(0);
	await expect(pageSizeSelect).toBeVisible();
	await pageSizeSelect.selectOption('3');
	await expect(pageSizeSelect).toHaveValue('3');
	await expect.poll(() => tableRows.count()).toBeLessThanOrEqual(3);

	const firstPageNames = await tableRows.locator('td:first-child').allInnerTexts();
	expect(firstPageNames.length).toBeGreaterThan(0);
	for (let rowIndex = 0; rowIndex < await tableRows.count(); rowIndex++) {
		await expect(tableRows.nth(rowIndex).locator('td')).toHaveCount(6);
	}
	console.log(`Captured ${firstPageNames.length} Student Names on page one`);

	// Steps 9-11: Open the next page and verify its names differ from page one.
	await page.getByRole('link', { name: 'Next' }).click();
	const secondPageNames = await tableRows.locator('td:first-child').allInnerTexts();
	expect(secondPageNames.length).toBeGreaterThan(0);
	expect(secondPageNames).not.toEqual(firstPageNames);
	for (let rowIndex = 0; rowIndex < await tableRows.count(); rowIndex++) {
		await expect(tableRows.nth(rowIndex).locator('td')).toHaveCount(6);
	}

	// Steps 12-14: Return to page one and change the page size to five.
	await page.getByRole('link', { name: 'Previous' }).click();
	await expect(tableRows.locator('td:first-child')).toHaveText(firstPageNames);
	await pageSizeSelect.selectOption('5');
	await expect(pageSizeSelect).toHaveValue('5');
	await expect.poll(() => tableRows.count()).toBeLessThanOrEqual(5);
	const firstPageRowsAtFive = await tableRows.allInnerTexts();
	const firstPageNamesAtFive = await tableRows.locator('td:first-child').allInnerTexts();
	expect(firstPageRowsAtFive.length).toBeGreaterThan(0);
	console.log(`Captured ${firstPageRowsAtFive.length} rows with page size five`);

	// Steps 15-20: Search for Female and verify all visible results match.
	await expect(searchInput).toBeVisible();
	await searchInput.fill(searchKeyword);
	await expect(searchInput).toHaveValue(searchKeyword);
	await expect.poll(async () => {
		const visibleRows = await tableRows.allInnerTexts();
		return visibleRows.length > 0 && visibleRows.every(row => row.includes(searchKeyword));
	}).toBe(true);

	const filteredRows = await tableRows.allInnerTexts();
	expect(filteredRows.length).toBeGreaterThan(0);
	for (const rowText of filteredRows) {
		expect(rowText).toContain(searchKeyword);
	}
	console.log(`Search returned ${filteredRows.length} rows containing ${searchKeyword}`);

	// Steps 21-22: Clear the search and capture the current first-page names.
	await searchInput.fill('');
	await expect(searchInput).toHaveValue('');
	await expect.poll(() => tableRows.allInnerTexts()).toEqual(firstPageRowsAtFive);
	const namesBeforeSort = await tableRows.locator('td:first-child').allInnerTexts();
	const statusText = await page.getByRole('status').innerText();
	const totalEntriesMatch = statusText.match(/of (\d+) entries/);
	expect(totalEntriesMatch).not.toBeNull();
	const totalEntries = Number(totalEntriesMatch?.[1]);
	const pageCountAtFive = Math.ceil(totalEntries / 5);
	const allRowsBeforeSort: string[] = [];

	for (let pageNumber = 1; pageNumber <= pageCountAtFive; pageNumber++) {
		await page.getByRole('link', { name: String(pageNumber), exact: true }).click();
		allRowsBeforeSort.push(...await tableRows.allInnerTexts());
	}
	await page.getByRole('link', { name: '1', exact: true }).click();
	await expect(tableRows.allInnerTexts()).resolves.toEqual(firstPageRowsAtFive);

	// Steps 23-27: Sort by Student Name and verify the displayed order.
	await studentNameHeader.click();
	const namesAfterFirstSort = await tableRows.locator('td:first-child').allInnerTexts();
	const allNamesBeforeSort = allRowsBeforeSort.map(row => row.split('\t')[0]);
	const expectedAscendingNames = [...allNamesBeforeSort].sort();
	const sortDirectionHint = await studentNameHeader.getAttribute('aria-label');
	const firstSortIsDescending = sortDirectionHint?.includes('activate to sort column ascending') ?? false;
	const expectedFirstSortNames = (firstSortIsDescending
		? [...expectedAscendingNames].reverse()
		: expectedAscendingNames).slice(0, 5);
	expect(namesAfterFirstSort).toEqual(expectedFirstSortNames);

	// Steps 28-30: Sort by Student Name again and verify the opposite order.
	await studentNameHeader.click();
	const namesAfterSecondSort = await tableRows.locator('td:first-child').allInnerTexts();
	const expectedSecondSortNames = (firstSortIsDescending
		? expectedAscendingNames
		: [...expectedAscendingNames].reverse()).slice(0, 5);
	expect(namesAfterSecondSort).toEqual(expectedSecondSortNames);
	console.log('Student Name sorting and sort-direction toggle are correct');

	// Steps 31-32: Sort by Gender and verify no row data was lost or changed.
	const rowsBeforeGenderSort: string[] = [];

	for (let pageNumber = 1; pageNumber <= pageCountAtFive; pageNumber++) {
		await page.getByRole('link', { name: String(pageNumber), exact: true }).click();
		rowsBeforeGenderSort.push(...await tableRows.allInnerTexts());
	}

	await page.getByRole('link', { name: '1', exact: true }).click();
	await page.getByRole('columnheader', { name: /Gender/ }).click();

	// Steps 33-35: Visit all pages, collect names, and verify data integrity.
	const rowsAfterGenderSort: string[] = [];
	const allStudentNames = new Set<string>();

	for (let pageNumber = 1; pageNumber <= pageCountAtFive; pageNumber++) {
		await page.getByRole('link', { name: String(pageNumber), exact: true }).click();
		rowsAfterGenderSort.push(...await tableRows.allInnerTexts());

		for (let rowIndex = 0; rowIndex < await tableRows.count(); rowIndex++) {
			const rowCells = tableRows.nth(rowIndex).locator('td');
			await expect(rowCells).toHaveCount(6);
			allStudentNames.add(await rowCells.first().innerText());
		}
	}

	expect([...rowsAfterGenderSort].sort()).toEqual([...rowsBeforeGenderSort].sort());
	expect(allStudentNames.size).toBe(totalEntries);
	console.log(`Verified ${allStudentNames.size} unique Student Names across all pages`);

	// Step 36: Reload and verify the table returns to its defaults.
	await page.reload();
	await expect(page).toHaveURL(pageUrl);
	await expect(pageSizeSelect).toHaveValue('3');
	await expect(searchInput).toHaveValue('');
	await expect(studentNameHeader).toHaveAttribute('aria-label', defaultStudentNameSort || '');
	await expect(tableRows.locator('td:first-child')).toHaveText(firstPageNames);
	console.log('Table search, page size, and sort are restored to their defaults');
});
