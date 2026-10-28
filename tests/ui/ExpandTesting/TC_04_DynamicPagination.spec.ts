import { test } from '@playwright/test';
import { ExpandTesting_DynamicPaginationPage } from '../../../src/pages/ExpandTesting_DynamicPaginationPage';
import { expandTestingBaseURL, joinBaseURL } from '../../../src/config/EnvironmentConfig';
import { URLConfig } from '../../../src/config/URLConfig';
import { PlaywrightUtils } from '../../../src/utils/PlaywrightUtils';

test('@regression TC_04_DynamicPagination: Page Size, Search, Sorting, and Integrity', async ({ page }) => {
	const dynamicPaginationPage = new ExpandTesting_DynamicPaginationPage(page);
	await page.route("**/*", async (route) => {
		const url = route.request().url();
		if (
			url.includes("googleads") ||
			url.includes("googlesyndication") ||
			url.includes("doubleclick") ||
			url.includes("googletagservices") ||
			url.includes("adservice.google") ||
			url.includes("google_vignette")
		) {
			await route.abort();
		} else {
			await route.continue();
		}
	});

	await PlaywrightUtils.navigateToURL(
		page,
		joinBaseURL(expandTestingBaseURL, URLConfig.UI.ExpandTesting.dynamicPaginationURL)
	);
	await dynamicPaginationPage.openTableAndSelectInitialPageSize();
	await dynamicPaginationPage.verifyNextPageAndSetExpandedPageSize();
	await dynamicPaginationPage.searchAndClearResults();
	await dynamicPaginationPage.sortStudentNamesAndVerifyOrder();
	await dynamicPaginationPage.sortGenderAndVerifyDataIntegrity();
	await dynamicPaginationPage.reloadAndVerifyDefaultTableState();
});
