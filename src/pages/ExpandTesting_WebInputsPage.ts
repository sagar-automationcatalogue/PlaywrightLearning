import { expect, Locator, Page } from "@playwright/test";
import { TC_03_WebInputsFormValidations } from "../../test-data/expnadTesting";

export class ExpandTesting_WebInputsPage {
    private page: Page;
    private numberInput: Locator;
    private textInput: Locator;
    private passwordInput: Locator;
    private dateInput: Locator;
    private displayInputsButton: Locator;
    private clearInputsButton: Locator;
    private numberOutput: Locator;
    private textOutput: Locator;
    private passwordOutput: Locator;
    private dateOutput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.numberInput = page.getByLabel("Input: Number");
        this.textInput = page.getByLabel("Input: Text");
        this.passwordInput = page.getByLabel("Input: Password");
        this.dateInput = page.getByLabel("Input: Date");
        this.displayInputsButton = page.getByRole("button", { name: "Display Inputs" });
        this.clearInputsButton = page.getByRole("button", { name: "Clear Inputs" });
        this.numberOutput = page.locator("#output-number");
        this.textOutput = page.locator("#output-text");
        this.passwordOutput = page.locator("#output-password");
        this.dateOutput = page.locator("#output-date");
    }

    async openAndVerifyInputs(): Promise<void> {
        await this.page.goto("https://practice.expandtesting.com/inputs");
        await expect(this.page).toHaveURL("https://practice.expandtesting.com/inputs");
        await expect(this.numberInput).toBeVisible();
        await expect(this.textInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.dateInput).toBeVisible();
        console.log("Display input fields are visible");
    }

    async enterDisplayAndClearInputValues(): Promise<void> {
        await this.numberInput.fill(TC_03_WebInputsFormValidations.inputs.number);
        await this.textInput.fill(TC_03_WebInputsFormValidations.inputs.text);
        await this.passwordInput.fill(TC_03_WebInputsFormValidations.inputs.password);
        await this.dateInput.fill(TC_03_WebInputsFormValidations.inputs.date);
        await expect(this.numberInput).toHaveValue(TC_03_WebInputsFormValidations.inputs.number);
        await expect(this.textInput).toHaveValue(TC_03_WebInputsFormValidations.inputs.text);
        await expect(this.passwordInput).toHaveValue(TC_03_WebInputsFormValidations.inputs.password);
        await expect(this.dateInput).toHaveValue(TC_03_WebInputsFormValidations.inputs.date);

        await this.displayInputsButton.click();
        await expect(this.numberOutput).toHaveText(TC_03_WebInputsFormValidations.inputs.number);
        await expect(this.textOutput).toHaveText(TC_03_WebInputsFormValidations.inputs.text);
        await expect(this.passwordOutput).toHaveText(TC_03_WebInputsFormValidations.inputs.password);
        await expect(this.dateOutput).toHaveText(TC_03_WebInputsFormValidations.inputs.date);

        await this.clearInputsButton.click();
        await expect(this.numberInput).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
        await expect(this.textInput).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
        await expect(this.passwordInput).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
        await expect(this.dateInput).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
    }
}
