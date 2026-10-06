import {expect, test} from '@playwright/test';
const TC_05_ProductReview={
    productName:'Blue Top',
    reviewName:'Playwright Student',
    reviewEmail: 'playwright.review@example.com',
    reviewText: `The product details and cart quantity were easy to verify with Playwright.`
}
test(`@regression TC_05_ProductReview: Product Detail → Quantity 4 → Add Cart → Submit Product Review`, async ({ page, browserName }) => {

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

    await page.goto('https://www.automationexercise.com/');
    await page.getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL('https://www.automationexercise.com/products');
    console.log('All Products page is open');

    const blueTopCard = page.locator('.product-image-wrapper').filter({ hasText: 'Blue Top' }).first();
    await expect(blueTopCard).toBeVisible();
    console.log('Blue Top is visible in the product list');

    await blueTopCard.getByRole('link', { name: 'View Product' }).click();
    await expect(page).toHaveURL(/product_details\/1/);
    console.log('Blue Top detail page is open');

    const productInformation = page.locator('.product-information');
    await expect(productInformation.locator('h2')).toHaveText(TC_05_ProductReview.productName);
    await expect(productInformation.getByText('Category: Women > Tops', { exact: true })).toBeVisible();
    console.log('Product name and category are correct');

    const unitPriceText = await productInformation.locator('span span').innerText();
    const unitPrice = Number(unitPriceText.replace('Rs.', '').trim());
    expect(unitPrice).toBeGreaterThan(0);
    console.log(`Captured Blue Top unit price: ${unitPriceText}`);

    await expect(productInformation.getByText('Availability: In Stock', { exact: true })).toBeVisible();
    await expect(productInformation.getByText('Condition: New', { exact: true })).toBeVisible();
    await expect(productInformation.getByText('Brand: Polo', { exact: true })).toBeVisible();
    console.log('Availability, condition, and brand are correct');

    const quantityInput = page.locator('#quantity');
    await expect(quantityInput).toBeVisible();
    const defaultQuantity = await quantityInput.inputValue();
    expect(defaultQuantity).toBe('1');
    console.log(`Captured default quantity: ${defaultQuantity}`);

    await quantityInput.fill('4');
    await expect(quantityInput).toHaveValue('4');
    console.log('Quantity is set to 4');

    await page.getByRole('button', { name: 'Add to cart' }).click();
    const cartModal = page.locator('#cartModal');
    await expect(cartModal).toBeVisible();
    await expect(cartModal).toContainText('Your product has been added to cart.');
    console.log('Add-to-cart confirmation is displayed');

    await cartModal.getByRole('link', { name: 'View Cart' }).click();
    await expect(page).toHaveURL('https://www.automationexercise.com/view_cart');
    console.log('Cart page is open');

    const blueTopCartRow = page.locator('#cart_info_table tbody tr').filter({ hasText: 'Blue Top' });
    await expect(blueTopCartRow).toBeVisible();
    await expect(blueTopCartRow.locator('.cart_quantity button')).toHaveText('4');

    const cartUnitPriceText = await blueTopCartRow.locator('.cart_price').innerText();
    const cartLineTotalText = await blueTopCartRow.locator('.cart_total').innerText();
    const cartUnitPrice = Number(cartUnitPriceText.replace('Rs.', '').trim());
    const cartLineTotal = Number(cartLineTotalText.replace('Rs.', '').trim());
    const expectedLineTotal = cartUnitPrice * 4;

    expect(cartUnitPrice).toBe(unitPrice);
    expect(cartLineTotal).toBe(expectedLineTotal);
    console.log(`Cart unit price: ${cartUnitPriceText}; line total: ${cartLineTotalText}`);
    console.log(`Verified line total: ${cartUnitPrice} × 4 = ${expectedLineTotal}`);

    await page.goBack();
    await expect(page).toHaveURL(/product_details\/1/);
    console.log('Returned to Blue Top detail page');

    const reviewHeading = page.getByText('Write Your Review', { exact: false });
    await reviewHeading.scrollIntoViewIfNeeded();
    await expect(reviewHeading).toBeVisible();

    const reviewName = page.locator('#name');
    const reviewEmail = page.locator('#email');
    const reviewText = page.locator('#review');
    await expect(reviewName).toBeVisible();
    await expect(reviewEmail).toBeVisible();
    await expect(reviewText).toBeVisible();
    console.log('Review form fields are visible');

    await reviewName.fill(TC_05_ProductReview.reviewName);
    await reviewEmail.fill(TC_05_ProductReview.reviewEmail);
    await reviewText.fill('');
    await expect(reviewName).toHaveValue(TC_05_ProductReview.reviewName);
    await expect(reviewEmail).toHaveValue(TC_05_ProductReview.reviewEmail);
    await expect(reviewText).toHaveValue(TC_05_ProductReview.reviewText);

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Thank you for your review.', { exact: true })).toBeVisible();
    console.log('Review submission is confirmed');

    await page.getByRole('link', { name: 'Cart' }).click();
    await expect(page).toHaveURL('https://www.automationexercise.com/view_cart');
    await expect(blueTopCartRow).toBeVisible();

    await blueTopCartRow.locator('.cart_quantity_delete').click();
    await expect(blueTopCartRow).toHaveCount(0);
    await expect(page.getByText('Cart is empty!', { exact: false })).toBeVisible();
    console.log('Blue Top was removed from the cart');
});