import { expect, Locator, Page } from "@playwright/test";
import { Constants } from "../constants/constants";

export class PlaywrightUtils {
    static async navigateToURL(page: Page, url: string): Promise<void> {
        await page.goto(url);
        await expect(page).toHaveURL(url);
        console.log(`Navigated to URL: ${url}`);
    }

    static async clearAndFillInput(input: Locator, value: string, fieldName?: string): Promise<void> {
        await input.clear();
        await expect(input).toHaveValue(Constants.emptyValue);
        await input.fill(value);
        await expect(input).toHaveValue(value);
        console.log(`${value} is entered in the ${fieldName ?? "input"} text-box`);
    }
}
