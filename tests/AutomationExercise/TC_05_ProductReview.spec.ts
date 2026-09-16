import {expect, test} from '@playwright/test';

test(`TC_05_ProductReview: Product Detail → Quantity 4 → Add Cart → Submit Product Review`, async({page, browserName}) =>{

    if(browserName === 'webkit'){
        //test.slow();
        test.setTimeout(90_000);
    }
    
    // =========================================================
    // Ignore / Block Google Advertisements
    // Keep this before page.goto()
    // =========================================================

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


    await page.goto(`https://www.automationexercise.com/`);

    await page.locator(`//a[text()=' Products']`).click();
    await expect(page).toHaveURL(`https://www.automationexercise.com/products`);
    console.log(`All products page is loaded`)

    //Auto-retrying assertion
    //let bluetop_product_locator = await page.locator(`//div[@class='productinfo text-center']/p[1]`).first();
    //await expect(bluetop_product_locator).toBeVisible({timeout:30_000});
    //await expect(bluetop_product_locator).toContainText(`Blue Top`);

    //Non-retrying assertion
    let bluetop_product_locator_message = await page.locator(`//div[@class='productinfo text-center']/p[1]`).first().innerText();
    expect(bluetop_product_locator_message).toBe('Blue Top');
    
    
    console.log(`Blue Top product is verified in products page`)

    await page.locator(`//div[@class='productinfo text-center']/p[text()='Blue Top']/../../..//a[text()='View Product']`);
})