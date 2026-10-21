import { test } from '@playwright/test';
import { ExpandTesting_DynamicPaginationPage } from '../../../src/pages/ExpandTesting_DynamicPaginationPage.ts';

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

	await dynamicPaginationPage.openTableAndSelectInitialPageSize();
	await dynamicPaginationPage.verifyNextPageAndSetExpandedPageSize();
	await dynamicPaginationPage.searchAndClearResults();
	await dynamicPaginationPage.sortStudentNamesAndVerifyOrder();
	await dynamicPaginationPage.sortGenderAndVerifyDataIntegrity();
	await dynamicPaginationPage.reloadAndVerifyDefaultTableState();
});
