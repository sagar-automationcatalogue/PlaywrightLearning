import { test } from '@playwright/test';
import { AutomationExercise_ProductReviewPage } from '../../../src/pages/AutomationExercise_ProductReviewPage';
import { HandlingPopups } from '../../../src/components/HandlingPopups';

test(`@regression TC_05_ProductReview: Product Detail → Quantity 4 → Add Cart → Submit Product Review`, async ({ page, browserName }) => {
    const productReviewPage = new AutomationExercise_ProductReviewPage(page);

    if (browserName === 'webkit') {
        test.setTimeout(90_000);
    }

    let ob_handlingPopups = new HandlingPopups();
    await ob_handlingPopups.handleGoogleAds(page);

    const unitPrice = await productReviewPage.openProductsAndBlueTopDetails();
    await productReviewPage.setQuantityAddToCartAndVerify(unitPrice);
    await productReviewPage.submitProductReview();
    await productReviewPage.removeBlueTopFromCart();
});