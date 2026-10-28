import { expect, Locator } from "@playwright/test";

export class AssertionUtils {
    static async verifyVisible(
        input: Locator,
        soft = false,
        fieldName?: string
    ): Promise<void> {
        if (soft) {
            await expect.soft(input).toBeVisible();
        } else {
            await expect(input).toBeVisible();
        }
        console.log(`${fieldName ?? "Element"} visibility is verified`);
    }
}
