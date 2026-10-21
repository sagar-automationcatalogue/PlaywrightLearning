import { expect, Locator, Page } from "@playwright/test";

export class ExpandTesting_CheckboxesPage {
    private page: Page;
    private checkbox1: Locator;
    private checkbox2: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkbox1 = page.locator("#checkbox1");
        this.checkbox2 = page.locator("#checkbox2");
    }

    async toggleCheckboxesAndVerifyStates(): Promise<void> {
        await this.page.goto("https://practice.expandtesting.com/checkboxes");
        await expect(this.page).toHaveURL("https://practice.expandtesting.com/checkboxes");
        await this.checkbox1.check();
        await this.checkbox2.uncheck();
        await expect(this.checkbox1).toBeChecked();
        await expect(this.checkbox2).not.toBeChecked();
        console.log("now toggle the checkboxes");
        await this.checkbox1.uncheck();
        await this.checkbox2.check();
        await expect(this.checkbox1).not.toBeChecked();
        await expect(this.checkbox2).toBeChecked();
        console.log("checkboxes interaction is working.");
    }
}
