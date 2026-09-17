import { test, expect } from '@playwright/test';

test(`TC_04_ProductDetails: Product Details → Quantity Controls → Specs → Add to Cart`, async({page})=>{
    await page.goto(`https://practicesoftwaretesting.com/`);

     const searchInput = page.locator('input[placeholder="Search"], input[aria-label="Search"], input[type="search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Combination Pliers');
    
    await page.getByRole('button', { name: 'Search' }).click();

    const productCard = page.locator('.card').filter({ hasText: 'Combination Pliers' });
    await expect(productCard).toBeVisible();

    /*const catalog_ProductName = await productCard.locator('.card-title').textContent();
    const catalog_Price = await productCard.locator('.card-text').textContent();*/

})