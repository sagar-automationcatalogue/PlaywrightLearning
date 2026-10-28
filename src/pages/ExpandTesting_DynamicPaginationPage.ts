import { expect, Locator, Page } from "@playwright/test";
import { TC_04_DynamicPagination } from "../../test-data/expnadTesting";
import { expandTestingBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";

export class ExpandTesting_DynamicPaginationPage {
    private page: Page;
    private readonly pageUrl = joinBaseURL(expandTestingBaseURL, URLConfig.UI.ExpandTesting.dynamicPaginationURL);
    private pageSizeSelect: Locator;
    private searchInput: Locator;
    private table: Locator;
    private tableHeaders: Locator;
    private tableRows: Locator;
    private studentNameHeader: Locator;
    private genderHeader: Locator;
    private statusText: Locator;
    private defaultStudentNameSort: string | null = null;
    private firstPageNames: string[] = [];
    private firstPageRowsAtFive: string[] = [];
    private totalEntries = 0;
    private pageCountAtFive = 0;
    private allRowsBeforeSort: string[] = [];
    private firstSortIsDescending = false;

    constructor(page: Page) {
        this.page = page;
        this.pageSizeSelect = page.getByRole("combobox", { name: "Show entries" });
        this.searchInput = page.getByRole("searchbox", { name: "Search:" });
        this.table = page.getByRole("table");
        this.tableHeaders = this.table.getByRole("columnheader");
        this.tableRows = page.locator("table tbody tr");
        this.studentNameHeader = page.getByRole("columnheader", { name: /Student Name/ });
        this.genderHeader = page.getByRole("columnheader", { name: /Gender/ });
        this.statusText = page.getByRole("status");
    }

    async openTableAndSelectInitialPageSize(): Promise<void> {
        this.defaultStudentNameSort = await this.studentNameHeader.getAttribute("aria-label");

        await expect(this.tableHeaders).toHaveText(TC_04_DynamicPagination.expectedHeaders);
        console.log("Dynamic pagination table and all expected headers are visible");

        const initialVisibleRowCount = await this.tableRows.count();
        expect(initialVisibleRowCount).toBeGreaterThan(0);
        await expect(this.pageSizeSelect).toBeVisible();
        await this.pageSizeSelect.selectOption(TC_04_DynamicPagination.pageSizes.initial);
        await expect(this.pageSizeSelect).toHaveValue(TC_04_DynamicPagination.pageSizes.initial);
        await expect.poll(() => this.tableRows.count()).toBeLessThanOrEqual(
            Number(TC_04_DynamicPagination.pageSizes.initial)
        );

        this.firstPageNames = await this.tableRows.locator("td:first-child").allInnerTexts();
        expect(this.firstPageNames.length).toBeGreaterThan(0);
        for (let rowIndex = 0; rowIndex < await this.tableRows.count(); rowIndex++) {
            await expect(this.tableRows.nth(rowIndex).locator("td"))
                .toHaveCount(TC_04_DynamicPagination.expectedColumnCount);
        }
        console.log(`Captured ${this.firstPageNames.length} Student Names on page one`);
    }

    async verifyNextPageAndSetExpandedPageSize(): Promise<void> {
        await this.page.getByRole("link", { name: "Next" }).click();
        await expect.poll(() => this.tableRows.locator("td:first-child").allInnerTexts())
            .not.toEqual(this.firstPageNames);
        const secondPageNames = await this.tableRows.locator("td:first-child").allInnerTexts();
        expect(secondPageNames.length).toBeGreaterThan(0);
        expect(secondPageNames).not.toEqual(this.firstPageNames);
        for (let rowIndex = 0; rowIndex < await this.tableRows.count(); rowIndex++) {
            await expect(this.tableRows.nth(rowIndex).locator("td"))
                .toHaveCount(TC_04_DynamicPagination.expectedColumnCount);
        }

        await this.page.getByRole("link", { name: "Previous" }).click();
        await expect(this.tableRows.locator("td:first-child")).toHaveText(this.firstPageNames);
        await this.pageSizeSelect.selectOption(TC_04_DynamicPagination.pageSizes.expanded);
        await expect(this.pageSizeSelect).toHaveValue(TC_04_DynamicPagination.pageSizes.expanded);
        await expect.poll(() => this.tableRows.count()).toBeLessThanOrEqual(
            Number(TC_04_DynamicPagination.pageSizes.expanded)
        );
        this.firstPageRowsAtFive = await this.tableRows.allInnerTexts();
        const firstPageNamesAtFive = await this.tableRows.locator("td:first-child").allInnerTexts();
        expect(this.firstPageRowsAtFive.length).toBeGreaterThan(0);
        console.log(`Captured ${this.firstPageRowsAtFive.length} rows with page size five`);
    }

    async searchAndClearResults(): Promise<void> {
        await expect(this.searchInput).toBeVisible();
        await this.searchInput.fill(TC_04_DynamicPagination.searchKeyword);
        await expect(this.searchInput).toHaveValue(TC_04_DynamicPagination.searchKeyword);
        await expect.poll(async () => {
            const visibleRows = await this.tableRows.allInnerTexts();
            return visibleRows.length > 0
                && visibleRows.every(row => row.includes(TC_04_DynamicPagination.searchKeyword));
        }).toBe(true);

        const filteredRows = await this.tableRows.allInnerTexts();
        expect(filteredRows.length).toBeGreaterThan(0);
        for (const rowText of filteredRows) {
            expect(rowText).toContain(TC_04_DynamicPagination.searchKeyword);
        }
        console.log(
            `Search returned ${filteredRows.length} rows containing ${TC_04_DynamicPagination.searchKeyword}`
        );

        await this.searchInput.fill("");
        await expect(this.searchInput).toHaveValue("");
        await expect.poll(() => this.tableRows.allInnerTexts()).toEqual(this.firstPageRowsAtFive);
        const statusText = await this.statusText.innerText();
        const totalEntriesMatch = statusText.match(/of (\d+) entries/);
        expect(totalEntriesMatch).not.toBeNull();
        this.totalEntries = Number(totalEntriesMatch?.[1]);
        this.pageCountAtFive = Math.ceil(
            this.totalEntries / Number(TC_04_DynamicPagination.pageSizes.expanded)
        );
    }

    async sortStudentNamesAndVerifyOrder(): Promise<void> {
        this.allRowsBeforeSort = [];
        for (let pageNumber = 1; pageNumber <= this.pageCountAtFive; pageNumber++) {
            await this.page.getByRole("link", { name: String(pageNumber), exact: true }).click();
            this.allRowsBeforeSort.push(...await this.tableRows.allInnerTexts());
        }
        await this.page.getByRole("link", { name: "1", exact: true }).click();
        await expect(this.tableRows.allInnerTexts()).resolves.toEqual(this.firstPageRowsAtFive);

        await this.studentNameHeader.click();
        const namesAfterFirstSort = await this.tableRows.locator("td:first-child").allInnerTexts();
        const allNamesBeforeSort = this.allRowsBeforeSort.map(row => row.split("\t")[0]);
        const expectedAscendingNames = [...allNamesBeforeSort].sort();
        const sortDirectionHint = await this.studentNameHeader.getAttribute("aria-label");
        this.firstSortIsDescending =
            sortDirectionHint?.includes("activate to sort column ascending") ?? false;
        const expectedFirstSortNames = (this.firstSortIsDescending
            ? [...expectedAscendingNames].reverse()
            : expectedAscendingNames).slice(0, Number(TC_04_DynamicPagination.pageSizes.expanded));
        expect(namesAfterFirstSort).toEqual(expectedFirstSortNames);

        await this.studentNameHeader.click();
        const namesAfterSecondSort = await this.tableRows.locator("td:first-child").allInnerTexts();
        const expectedSecondSortNames = (this.firstSortIsDescending
            ? expectedAscendingNames
            : [...expectedAscendingNames].reverse()).slice(0, Number(TC_04_DynamicPagination.pageSizes.expanded));
        expect(namesAfterSecondSort).toEqual(expectedSecondSortNames);
        console.log("Student Name sorting and sort-direction toggle are correct");
    }

    async sortGenderAndVerifyDataIntegrity(): Promise<void> {
        const rowsBeforeGenderSort: string[] = [];
        for (let pageNumber = 1; pageNumber <= this.pageCountAtFive; pageNumber++) {
            await this.page.getByRole("link", { name: String(pageNumber), exact: true }).click();
            rowsBeforeGenderSort.push(...await this.tableRows.allInnerTexts());
        }

        await this.page.getByRole("link", { name: "1", exact: true }).click();
        await this.genderHeader.click();

        const rowsAfterGenderSort: string[] = [];
        const allStudentNames = new Set<string>();
        for (let pageNumber = 1; pageNumber <= this.pageCountAtFive; pageNumber++) {
            await this.page.getByRole("link", { name: String(pageNumber), exact: true }).click();
            rowsAfterGenderSort.push(...await this.tableRows.allInnerTexts());

            for (let rowIndex = 0; rowIndex < await this.tableRows.count(); rowIndex++) {
                const rowCells = this.tableRows.nth(rowIndex).locator("td");
                await expect(rowCells).toHaveCount(TC_04_DynamicPagination.expectedColumnCount);
                allStudentNames.add(await rowCells.first().innerText());
            }
        }

        expect([...rowsAfterGenderSort].sort()).toEqual([...rowsBeforeGenderSort].sort());
        expect(allStudentNames.size).toBe(this.totalEntries);
        console.log(`Verified ${allStudentNames.size} unique Student Names across all pages`);
    }

    async reloadAndVerifyDefaultTableState(): Promise<void> {
        await this.page.reload();
        await expect(this.page).toHaveURL(this.pageUrl);
        await expect(this.pageSizeSelect).toHaveValue(TC_04_DynamicPagination.pageSizes.initial);
        await expect(this.searchInput).toHaveValue("");
        await expect(this.studentNameHeader).toHaveAttribute("aria-label", this.defaultStudentNameSort || "");
        await expect(this.tableRows.locator("td:first-child")).toHaveText(this.firstPageNames);
        console.log("Table search, page size, and sort are restored to their defaults");
    }
}
