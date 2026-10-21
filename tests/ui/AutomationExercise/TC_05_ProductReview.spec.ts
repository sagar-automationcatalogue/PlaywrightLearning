import { test } from '@playwright/test';
import { AutomationExercise_ProductReviewPage } from '../../../src/pages/AutomationExercise_ProductReviewPage.ts';

test(`@regression TC_05_ProductReview: Product Detail → Quantity 4 → Add Cart → Submit Product Review`, async ({ page, browserName }) => {
    const productReviewPage = new AutomationExercise_ProductReviewPage(page);

    if (browserName === 'webkit') {
        test.setTimeout(90_000);
    }

    await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (
            url.includes('googleads') ||
            url.includes('googlesyndication') ||
            url.includes('doubleclick') ||
            url.includes('googletagservices') ||
            url.includes('adservice.google') ||
            url.includes('google_vignette')
        ) {
            await route.abort();
        }
        else {
            await route.continue();
        }
    });

    const unitPrice = await productReviewPage.openProductsAndBlueTopDetails();
    await productReviewPage.setQuantityAddToCartAndVerify(unitPrice);
    await productReviewPage.submitProductReview();
    await productReviewPage.removeBlueTopFromCart();
});