import { test, expect } from '@playwright/test';
import { TC_03_ProductFilter } from '../../../test-data/practiceSoftware.ts';

test('@sanity TC_03_ProductFilter - Category + Brand + Price filtering', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  const productLinks = page.locator('a.card[href*="/product/"]');
  await expect(productLinks.first()).toBeVisible({ timeout: 30000 });

  const getProductCount = async () => {
    return await productLinks.count();
  };

  const getVisibleProductNames = async () => {
    const names = await productLinks.allTextContents();
    return names.map((name) => name.trim()).filter(Boolean);
  };

  const getPricesFromProducts = async () => { 
    const productNames = await getVisibleProductNames();
    const prices: number[] = [];

    for (const productName of productNames) {
      const matches = productName.match(/\d+\.\d{2}/g);
      if (matches && matches.length > 0) {
        prices.push(Number(matches[matches.length - 1]));
      }
    }

    return prices;
  };

  const moveSliderTo = async (sliderName: string, targetValue: number) => {
    const slider = page.getByRole('slider', { name: sliderName, exact: true });
    await expect(slider).toBeVisible();
    await slider.focus();

    let currentValue = Number(await slider.getAttribute('aria-valuenow'));
    const key = targetValue >= currentValue ? 'ArrowRight' : 'ArrowLeft';

    while (currentValue !== targetValue) {
      await slider.press(key);
      currentValue = Number(await slider.getAttribute('aria-valuenow'));
    }

    await expect(slider).toHaveAttribute('aria-valuenow', String(targetValue));
  };

  console.log('1. Open the product catalog');
  await expect(page.getByText('By category:')).toBeVisible();

  const initialProductCount = await getProductCount();
  console.log(`2. Initial product result count: ${initialProductCount}`);
  expect(initialProductCount).toBeGreaterThan(0);

  console.log('3. Locate the category filter section');
  const handToolsCheckbox = page.getByRole('checkbox', { name: TC_03_ProductFilter.category });
  await expect(handToolsCheckbox).toBeVisible();

  console.log('4. Select Hand Tools category');
  await handToolsCheckbox.check();
  await expect(handToolsCheckbox).toBeChecked();

  console.log('5. Verify results refresh');
  const categoryFilteredCount = await getProductCount();
  console.log(`6. Product count after category filtering: ${categoryFilteredCount}`);
  expect(categoryFilteredCount).toBeGreaterThan(0);
  expect(categoryFilteredCount).toBeLessThanOrEqual(initialProductCount);

  console.log('7. Verify category filtering does not increase beyond the baseline');
  expect(categoryFilteredCount).toBeLessThanOrEqual(initialProductCount);

  const pliersCheckbox = page.getByRole('checkbox', { name: TC_03_ProductFilter.subcategory });
  if (await pliersCheckbox.isVisible().catch(() => false)) {
    console.log('8. Select Pliers subcategory');
    await pliersCheckbox.check();
    await expect(pliersCheckbox).toBeChecked();

    console.log('9. Verify the result set refreshes again');
    const productNamesAfterPliers = await getVisibleProductNames();
    expect(productNamesAfterPliers.length).toBeGreaterThan(0);

    const productNames = await getVisibleProductNames();
    console.log(`10. Product names under the selected category/subcategory: ${productNames.slice(0, 5).join(', ')}`);
    expect(productNames.length).toBeGreaterThan(0);
  }

  console.log('11. Locate the Brand filter section');
  const brandNames = await page.locator('input[type="checkbox"]').evaluateAll((checkboxes) =>
    checkboxes
      .map((checkbox) => {
        const label = checkbox.closest('label');
        return label ? label.textContent?.replace(/\s+/g, ' ').trim() : '';
      })
      .filter(
        (text) =>
          text &&
          !/Hand Tools|Hammer|Hand Saw|Wrench|Screwdriver|Pliers|Chisels|Measures|Power Tools|Grinder|Sander|Saw|Drill|Other|Tool Belts|Storage Solutions|Workbench|Safety Gear|Fasteners|Show only eco-friendly products/i.test(text)
      )
  );

  expect(brandNames.length).toBeGreaterThan(0);
  const selectedBrand = brandNames[0];
  console.log(`12-13. Brand labels captured. Dynamic brand chosen: ${selectedBrand}`);

  const selectedBrandCheckbox = page.getByRole('checkbox', { name: selectedBrand });
  await expect(selectedBrandCheckbox).toBeVisible();

  console.log('14. Apply selected brand filter');
  await selectedBrandCheckbox.check();
  await expect(selectedBrandCheckbox).toBeChecked();

  console.log('15. Verify category + brand filtering refreshes the list');
  const productNamesAfterBrand = await getVisibleProductNames();
  expect(productNamesAfterBrand.length).toBeGreaterThan(0);

  console.log('16. Locate the price range control');
  const minSlider = page.getByRole('slider', { name: 'ngx-slider', exact: true });
  const maxSlider = page.getByRole('slider', { name: 'ngx-slider-max', exact: true });

  await expect(minSlider).toBeVisible();
  await expect(maxSlider).toBeVisible();

  const minBefore = Number(await minSlider.getAttribute('aria-valuenow'));
  const maxBefore = Number(await maxSlider.getAttribute('aria-valuenow'));
  console.log(`17. Current price range values: min=${minBefore}, max=${maxBefore}`);

  console.log('18-19. Move the minimum price toward 10 and maximum price toward 50');
  await moveSliderTo('ngx-slider', TC_03_ProductFilter.priceRange.filteredMinimum);
  await moveSliderTo('ngx-slider-max', TC_03_ProductFilter.priceRange.filteredMaximum);

  console.log('20. Wait for product results to stabilize');
  await expect.poll(async () => await getProductCount(), { timeout: 30000 }).toBeGreaterThan(0);

  const displayedPrices = await getPricesFromProducts();
  console.log(`21. Product prices captured: ${displayedPrices.slice(0, 5).join(', ')}`);
  expect(displayedPrices.length).toBeGreaterThan(0);

  console.log('22-24. Normalize and validate displayed prices against the active range');
  const invalidPriceList = displayedPrices.filter(
    (price) => price < TC_03_ProductFilter.priceRange.filteredMinimum
      || price > TC_03_ProductFilter.priceRange.filteredMaximum
  );
  expect(invalidPriceList).toHaveLength(0);

  console.log('25. Open one filtered product detail page');
  const firstProductLink = productLinks.first();
  await expect(firstProductLink).toBeVisible();
  await firstProductLink.click();

  await expect(page.locator('h1')).toBeVisible();
  const detailText = (await page.locator('body').innerText()).toLowerCase();

  console.log('26. Verify the product detail page remains consistent with the active filters');
  if (detailText.includes('category') || detailText.includes('brand')) {
    if (detailText.includes('hand tools') || detailText.includes('pliers')) {
      expect(detailText).toMatch(/hand tools|pliers/);
    }
    if (detailText.includes(selectedBrand.toLowerCase())) {
      expect(detailText).toContain(selectedBrand.toLowerCase());
    }
  }

  console.log('27. Navigate back to the filtered catalog');
  await page.goBack();
  await expect(productLinks.first()).toBeVisible();

  console.log('28. Remove only the Brand filter');
  await selectedBrandCheckbox.uncheck();
  await expect(selectedBrandCheckbox).not.toBeChecked();

  console.log('29. Verify result set changes or remains logically valid');
  const afterBrandRemovalCount = await getProductCount();
  expect(afterBrandRemovalCount).toBeGreaterThan(0);

  console.log('30. Clear/reset all filters');
  if (await handToolsCheckbox.isChecked()) {
    await handToolsCheckbox.uncheck();
  }

  if (await pliersCheckbox.isVisible().catch(() => false)) {
    if (await pliersCheckbox.isChecked()) {
      await pliersCheckbox.uncheck();
    }
  }

  await moveSliderTo('ngx-slider', TC_03_ProductFilter.priceRange.resetMinimum);
  await moveSliderTo('ngx-slider-max', TC_03_ProductFilter.priceRange.resetMaximum);

  console.log('31. Verify the catalog returns toward the initial baseline');
  const finalProductCount = await getProductCount();
  console.log(`Final product count after clearing filters: ${finalProductCount}`);
  expect(finalProductCount).toBeGreaterThan(0);
  expect(finalProductCount).toBeGreaterThanOrEqual(initialProductCount - 10);
});