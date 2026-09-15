// import {expect, test} from '@playwright/test';

// test(`TC_05_ProductReview: Product Detail → Quantity 4 → Add Cart → Submit Product Review`, async({page}) =>{

//     // =========================================================
//     // Ignore / Block Google Advertisements
//     // Keep this before page.goto()
//     // =========================================================

//    await page.route('**/*', async (route) => {
<<<<<<< Updated upstream
    
    
//         const url = route.request().url();
//         if (
//             url.includes('googleads') ||
//             url.includes('googlesyndication') ||
//             url.includes('doubleclick') ||
//             url.includes('googletagservices') ||
//             url.includes('adservice.google') ||
//             url.includes('google_vignette')
//         ) {
//             await route.abort();
//         }
//         else {
//             await route.continue();
//         }
//     });


//     await page.goto(`https://www.automationexercise.com/`);

//     await page.locator(`//a[text()=' Products']`).click();
//     await expect(page).toHaveURL(`https://www.automationexercise.com/products`);
//     console.log(`All products page is loaded`)

    let bluetop_product_locator = await page.locator(`//div[@class='productinfo text-center']/p[1]`).first();
    await expect(bluetop_product_locator).toBeVisible();
=======
>>>>>>> Stashed changes
    
    
//         const url = route.request().url();
//         if (
//             url.includes('googleads') ||
//             url.includes('googlesyndication') ||
//             url.includes('doubleclick') ||
//             url.includes('googletagservices') ||
//             url.includes('adservice.google') ||
//             url.includes('google_vignette')
//         ) {
//             await route.abort();
//         }
//         else {
//             await route.continue();
//         }
//     });


//     await page.goto(`https://www.automationexercise.com/`);

//     await page.locator(`//a[text()=' Products']`).click();
//     await expect(page).toHaveURL(`https://www.automationexercise.com/products`);
//     console.log(`All products page is loaded`)

//     let bluetop_product_locator = await page.locator(`//div[@class='productinfo text-center']/p[1]`).first();
//     await expect(bluetop_product_locator).toBeVisible();
    
//     await expect(bluetop_product_locator).toContainText(`Blue Top`);
//     console.log(`Blue Top product is verified in products page`)

//     await page.locator(`//div[@class='productinfo text-center']/p[text()='Blue Top']/../../..//a[text()='View Product']`);
// }) 

// */

<<<<<<< Updated upstream
//     await page.locator(`//div[@class='productinfo text-center']/p[text()='Blue Top']/../../..//a[text()='View Product']`);
// }) 

// */

=======
>>>>>>> Stashed changes
