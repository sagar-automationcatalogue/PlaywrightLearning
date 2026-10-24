import { test } from '@playwright/test';
import { AutomationExercise_CategoryProductsPage } from '../../../src/pages/AutomationExercise_CategoryProductsPage';

/** Testcase developed by Vijaya Durgi - Completed */
test('@regression TC_03_CategoryProducts:', async ({ page }) => {
  const categoryProductsPage = new AutomationExercise_CategoryProductsPage(page);

  // Prevent advertisements from covering category and brand links.
  await page.route(/googleads|googlesyndication|doubleclick|googletagservices|adservice\.google/, route => route.abort());

  await categoryProductsPage.openHomeAndVerifyCategoryAndBrandSidebars();
  const womenTopsUrl = await categoryProductsPage.selectWomenTopsAndCaptureProducts();
  await categoryProductsPage.selectMenJeansAndVerifyDifferentCategory(womenTopsUrl);
  await categoryProductsPage.openAllProductsAndVerifyBrandLabels();
  const poloUrl = await categoryProductsPage.selectPoloAndCaptureProducts();
  await categoryProductsPage.selectHmAndVerifyDifferentBrand(poloUrl);
  await categoryProductsPage.restoreAllProductsAndVerifySidebarsUsable();
});
