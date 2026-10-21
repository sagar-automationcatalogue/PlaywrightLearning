import { expect, Locator, Page } from "@playwright/test";

export class ExpandTesting_RadioButtonsPage {
    private page: Page;
    private blueColor: Locator;
    private redColor: Locator;
    private yellowColor: Locator;
    private blackColor: Locator;
    private greenColor: Locator;
    private tennisSport: Locator;
    private footballSport: Locator;
    private basketballSport: Locator;

    constructor(page: Page) {
        this.page = page;
        this.blueColor = page.locator("#blue");
        this.redColor = page.locator("#red");
        this.yellowColor = page.locator("#yellow");
        this.blackColor = page.locator("#black");
        this.greenColor = page.locator("#green");
        this.tennisSport = page.locator("#tennis");
        this.footballSport = page.locator("#football");
        this.basketballSport = page.locator("#basketball");
    }

    async selectColorAndSportAndVerifyExclusivity(): Promise<void> {
        await this.page.goto("https://practice.expandtesting.com/radio-buttons");
        await expect(this.page).toHaveURL("https://practice.expandtesting.com/radio-buttons");
        await this.blueColor.check();
        await this.tennisSport.check();
        await expect(this.blueColor).toBeChecked();
        await expect(this.redColor).not.toBeChecked();
        await expect(this.yellowColor).not.toBeChecked();
        await expect(this.blackColor).not.toBeChecked();
        await expect(this.greenColor).not.toBeChecked();
        console.log("only one color is selected");
        await expect(this.tennisSport).toBeChecked();
        await expect(this.footballSport).not.toBeChecked();
        await expect(this.basketballSport).not.toBeChecked();
        console.log("only one sport is selected");
    }
}
