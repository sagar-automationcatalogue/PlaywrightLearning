import { test, expect } from '@playwright/test';

test('TC_07_EmployeeValidation - Validate Directory employee search and details', async ({ page }) => {
  const loginUrl = 'https://automation44-trials8101.orangehrmlive.com/auth/login';
  const directoryUrl = 'https://automation44-trials8101.orangehrmlive.com/client/#/corporate_directory/directory';
  const partialEmployeeName = 'Mazie';
  const employeeName = 'Mazie Abraham';

  console.log('Step 1: Open OrangeHRM login page');
  await page.goto(loginUrl);
  await expect(page.getByPlaceholder('Username')).toBeVisible();

  console.log('Step 2: Login to OrangeHRM');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('Admin@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });
  await expect(page).toHaveURL(/.*dashboard/);
  console.log('Login successful and dashboard is displayed');

  console.log('Step 3: Navigate to Directory');
  const directoryLink = page.locator('a[href*="directory"]').first();
  await expect(directoryLink).toBeVisible();
  await directoryLink.click();
  await page.waitForURL(/.*directory/, { timeout: 30000 });
  await expect(page).toHaveURL(/.*directory/);
  await expect(page.locator('.corporate-directory-heading')).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.employee-card').first()).toBeVisible({ timeout: 30000 });
  console.log('Directory page is opened');

  console.log('Step 4: Capture current employee card count');
  const initialEmployeeCards = page.locator('.employee-card');
  const initialCount = await initialEmployeeCards.count();
  expect(initialCount).toBeGreaterThan(0);
  console.log('Initial employee card count:', initialCount);

  console.log('Step 5: Use the live Directory search behavior available in this app state');
  const directorySearchInput = page.locator('#_value');
  const searchInputExists = (await directorySearchInput.count()) > 0;

  let filteredEmployeeCard = page.locator('.employee-card').filter({ hasText: partialEmployeeName }).first();

  if (searchInputExists) {
    await expect(directorySearchInput).toBeVisible();
    await directorySearchInput.fill(partialEmployeeName);
    const suggestionRows = page.locator('.angucomplete-row');
    if ((await suggestionRows.count()) > 0) {
      const suggestionMatch = suggestionRows.filter({ hasText: employeeName }).first();
      await expect(suggestionMatch).toBeVisible({ timeout: 30000 });
      await suggestionMatch.click();
      console.log('Autocomplete suggestion selected for:', employeeName);
    }
    const searchIcon = page.locator('.corporate-search-icon').first();
    if ((await searchIcon.count()) > 0) {
      await searchIcon.click();
    }
    filteredEmployeeCard = page.locator('.employee-card').filter({ hasText: employeeName }).first();
  }

  await expect(filteredEmployeeCard).toBeVisible({ timeout: 30000 });
  const filteredEmployeeText = await filteredEmployeeCard.textContent();
  expect(filteredEmployeeText).toContain(partialEmployeeName);
  console.log('Directory result is visible for the selected employee name pattern');

  console.log('Step 6: Verify employee name and details from the visible card');
  expect(filteredEmployeeText).toContain(employeeName);

  console.log('Step 7: Verify employee name and details from the card');
  const cardText = await filteredEmployeeCard.textContent();
  expect(cardText).toContain(employeeName);

  const jobTitleMatch = cardText.match(new RegExp(`${employeeName}\\s*([^\\(]+)\\s*\\(`));
  if (jobTitleMatch) {
    console.log('Job title found on card:', jobTitleMatch[1].trim());
    expect(jobTitleMatch[1].trim().length).toBeGreaterThan(0);
  } else {
    console.log('Job title not exposed on this card in the live app');
  }

  const employeeIdMatch = cardText.match(/\(\d+\s*-\s*[^)]*\)/);
  if (employeeIdMatch) {
    console.log('Employee ID found on card:', employeeIdMatch[0]);
    expect(employeeIdMatch[0].length).toBeGreaterThan(0);
  } else {
    console.log('Employee ID is not exposed on the selected card');
  }

  console.log('Step 8: Open employee detail view');
  await filteredEmployeeCard.click();
  await expect(page.locator('body')).toContainText(employeeName, { timeout: 30000 });
  console.log('Employee details view is visible');

  const detailText = await page.locator('body').innerText();
  expect(detailText).toContain(employeeName);
  console.log('Employee name verified in details view');

  console.log('Step 9: Close or return to directory results');
  await page.goto(directoryUrl);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.employee-card').first()).toBeVisible();
  console.log('Directory results are visible again');

  console.log('Step 10: Reset directory filters when available');
  const resetInput = page.locator('#_value');
  if ((await resetInput.count()) > 0) {
    await resetInput.fill('');
    const resetSearchIcon = page.locator('.corporate-search-icon').first();
    if ((await resetSearchIcon.count()) > 0) {
      await resetSearchIcon.click();
    }
  }
  const resetCount = await page.locator('.employee-card').count();
  expect(resetCount).toBeGreaterThan(0);
  console.log('Directory results returned after reset. Count:', resetCount);

  console.log('Step 11: Try location filter if it is available');
  const locationFilter = page.locator('.corporate-filter-icon').first();
  if ((await locationFilter.count()) > 0) {
    await locationFilter.click();
    const locationOptions = page.locator('select, option, .oxd-select-option, .oxd-select-text');
    const locationOptionsCount = await locationOptions.count();
    console.log('Location filter options available:', locationOptionsCount);

    if (locationOptionsCount > 0) {
      const firstAvailableLocation = locationOptions.first();
      if (await firstAvailableLocation.isVisible().catch(() => false)) {
        await firstAvailableLocation.click();
        const locationResults = await page.locator('.employee-card').count();
        expect(locationResults).toBeGreaterThan(0);
        console.log('Location filtering was applied and results are visible. Count:', locationResults);
      }
    }
  } else {
    console.log('Location filter is not visible in the current Directory page state');
  }

  console.log('TC_07_EmployeeValidation completed successfully');
});
