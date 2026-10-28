import { Page } from "@playwright/test";

export class HandlingPopups {
    async handleGoogleAds(page: Page): Promise<void> {
        await page.route("**/*", async route => {
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
    }

    async handleGoogleAdds(page: Page): Promise<void> {
        await this.handleGoogleAds(page);
    }
}
