import { expect, Locator, Page } from "@playwright/test";
import { TC_03_WebInputsFormValidations } from "../../test-data/expnadTesting";

export class ExpandTesting_DropdownPage {
    private page: Page;
    private simpleDropdown: Locator;
    private elementsPerPage: Locator;
    private countryDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.simpleDropdown = page.locator("#dropdown");
        this.elementsPerPage = page.locator("#elementsPerPageSelect");
        this.countryDropdown = page.locator("#country");
    }

    async selectDropdownValuesAndVerify(): Promise<void> {
        await this.page.goto("https://practice.expandtesting.com/dropdown");
        await expect(this.page).toHaveURL("https://practice.expandtesting.com/dropdown");
        await this.simpleDropdown.selectOption(TC_03_WebInputsFormValidations.dropdownValues.simple);
        await this.elementsPerPage.selectOption(TC_03_WebInputsFormValidations.dropdownValues.elementsPerPage);
        await this.countryDropdown.selectOption(TC_03_WebInputsFormValidations.dropdownValues.country);
        await expect(this.simpleDropdown).toHaveValue(TC_03_WebInputsFormValidations.dropdownValues.simple);
        await expect(this.elementsPerPage).toHaveValue(TC_03_WebInputsFormValidations.dropdownValues.elementsPerPage);
        await expect(this.countryDropdown).toHaveValue(TC_03_WebInputsFormValidations.dropdownValues.country);
        console.log("selected values are displayed");
    }
}
