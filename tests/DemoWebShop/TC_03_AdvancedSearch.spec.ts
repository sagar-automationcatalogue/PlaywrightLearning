import {expect, test} from '@playwright/test'
test('TC_03_AdvancedSearch: Advanced Search with Category, Subcategory and Price', async({page})=>{

    await page.goto('https://demowebshop.tricentis.com/');
    console.log(`Home page is loaded`);
    const searchtextbox = page.locator(`.search-box-text.ui-autocomplete-input`);
    await expect(searchtextbox).toBeVisible();
    await searchtextbox.fill(`computer`);
    await page.getByRole('button', {name:`Search`}).click();
    const searchresults = page.locator(`.search-results`);
    const count = await searchresults.count();
    expect (count).toBeGreaterThan(0);
    console.log(`Search Results Page is displayed`);
    //const resultNames: string[] = await page.locator('.search-results').allTextContents();
    const resultNames: string[] = await page.locator('.search-results').allInnerTexts();
    console.log(`Results name: ${resultNames}`);
    //expect (resultNames).toContain(`computer`);
    //expect(resultNames).toEqual(expect.arrayContaining(['Build your own computer']));
    await page.getByLabel(`Advanced search`).check();
    await page.locator(`#Q`).fill(`computer`);
    const selectcategory = page.locator(`#Cid`);
    await page.selectOption(`#Cid`, {label:'Computers'});
    await page.locator(`#Isc`).check();
    await page.locator(`.price-from`).fill(`700`);
    await page.locator(`.price-to`).fill(`1900`);
    //await page.getByRole('checkbox', {name: `Sid`}).check();
    await page.getByLabel(`Search In product descriptions`).check();
    //await page.getByRole(`button`,{name: `Search`}).click();
    await page.locator(`.button-1.search-button`).click();
    const priceTexts: string[] = await page.locator(`.price.actual-price`).allInnerTexts();
    console.log(`Prices of all displayed results:${priceTexts}`);
    const Prices: number[] = priceTexts.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
    console.log('Prices found:', Prices);

  for (const price of Prices) {
    // Hard assertions - test stops even if one fails
    Prices.forEach(price => {
    expect(price).toBeGreaterThanOrEqual(700);
    expect(price).toBeLessThanOrEqual(1900);
  });
  }

});
