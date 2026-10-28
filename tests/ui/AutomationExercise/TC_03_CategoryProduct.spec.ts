import { test } from '@playwright/test';
import { AutomationExercise_CategoryProductsPage } from '../../../src/pages/AutomationExercise_CategoryProductsPage';
import { HandlingPopups } from '../../../src/components/HandlingPopups';

/** Testcase developed by Vijaya Durgi - Completed */
test('@regression TC_03_CategoryProducts:', async ({ page }) => {
  const categoryProductsPage = new AutomationExercise_CategoryProductsPage(page);

  // Prevent advertisements from covering category and brand links.
  let ob_handlingPopups = new HandlingPopups();
  await ob_handlingPopups.handleGoogleAds(page);

  await categoryProductsPage.openHomeAndVerifyCategoryAndBrandSidebars();
  const womenTopsUrl = await categoryProductsPage.selectWomenTopsAndCaptureProducts();
  await categoryProductsPage.selectMenJeansAndVerifyDifferentCategory(womenTopsUrl);
  await categoryProductsPage.openAllProductsAndVerifyBrandLabels();
  const poloUrl = await categoryProductsPage.selectPoloAndCaptureProducts();
  await categoryProductsPage.selectHmAndVerifyDifferentBrand(poloUrl);
  await categoryProductsPage.restoreAllProductsAndVerifySidebarsUsable();
});
