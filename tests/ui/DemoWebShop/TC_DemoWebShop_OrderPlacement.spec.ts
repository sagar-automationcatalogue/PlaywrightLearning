import { expect, test } from '@playwright/test';
import { TC_01_Authentication } from '../../../test-data/demoWebShop.ts';

test('@regression TC_DemoWebShop_OrderPlacement: Place an order for a notebook', async ({ page }) => {
    //HomePage
    console.log('Opening Demo Web Shop and logging in');
    await page.goto('https://demowebshop.tricentis.com/');
    await page.getByRole('link', { name: 'Log in', exact: true }).click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/login');
    //LoginPage
    await page.getByLabel('Email:', { exact: true }).fill(TC_01_Authentication.email);
    await page.getByLabel('Password:', { exact: true }).fill(TC_01_Authentication.validPassword);
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page.getByRole('link', { name: TC_01_Authentication.email, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out', exact: true })).toBeVisible();
    console.log('Login completed');
    //CataloguePage
    console.log('Opening the Computers > Notebooks category');
    await page.locator('.top-menu').getByRole('link', { name: 'Computers', exact: true }).click();
    await expect(page).toHaveURL(/\/computers$/);
    await page.locator('.sub-category-grid').getByRole('link', { name: 'Notebooks', exact: true }).click();
    await expect(page).toHaveURL(/\/notebooks$/);
    await expect(page.getByRole('heading', { name: 'Notebooks', exact: true })).toBeVisible();

    const notebookName = '14.1-inch Laptop';
    const notebookProduct = page.locator('.product-item').filter({
        has: page.getByRole('link', { name: notebookName, exact: true })
    });
    await expect(notebookProduct).toHaveCount(1);
    await notebookProduct.getByRole('link', { name: notebookName, exact: true }).click();
    await expect(page.getByRole('heading', { name: notebookName, exact: true })).toBeVisible();

    console.log(`Adding ${notebookName} to the shopping cart`);
    await page.locator('.product-essential').getByRole('button', { name: 'Add to cart', exact: true }).click();
    await expect(page.locator('.bar-notification')).toContainText('The product has been added to your shopping cart');
    //ShoppingCartPage
    console.log('Opening the shopping cart and setting the quantity to 2');
    await page.locator('#topcartlink').getByRole('link').click();
    await expect(page.getByRole('heading', { name: 'Shopping cart', exact: true })).toBeVisible();
    const notebookCartRow = page.locator('.cart-item-row').filter({
        has: page.getByRole('link', { name: notebookName, exact: true })
    });
    await expect(notebookCartRow).toBeVisible();
    const notebookQuantity = notebookCartRow.locator('.qty-input');
    await notebookQuantity.fill('2');
    await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
    await expect(notebookQuantity).toHaveValue('2');

    console.log('Accepting the terms of service and starting checkout');
    const termsOfService = page.locator('#termsofservice');
    await termsOfService.check();
    await expect(termsOfService).toBeChecked();
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    //CheckoutPage
    console.log('Selecting the existing billing address');
    const billingAddress = page.locator('#billing-address-select');
    await expect(billingAddress).toBeVisible();
    const savedBillingAddresses = billingAddress.locator('option').filter({ hasNotText: /new address/i });
    await expect(savedBillingAddresses.first()).toBeAttached();
    const savedBillingAddressId = await savedBillingAddresses.first().getAttribute('value');
    if (savedBillingAddressId === null) {
        throw new Error('The saved billing address does not have a selectable value.');
    }
    await billingAddress.selectOption(savedBillingAddressId);
    await expect(billingAddress.locator('option:checked')).not.toHaveText(/new address/i);
    await page.locator('#billing-buttons-container').getByRole('button', { name: 'Continue', exact: true }).click();

    console.log('Selecting the existing shipping address');
    const shippingAddress = page.locator('#shipping-address-select');
    await expect(shippingAddress).toBeVisible();
    const savedShippingAddresses = shippingAddress.locator('option').filter({ hasNotText: /new address/i });
    await expect(savedShippingAddresses.first()).toBeAttached();
    const savedShippingAddressId = await savedShippingAddresses.first().getAttribute('value');
    if (savedShippingAddressId === null) {
        throw new Error('The saved shipping address does not have a selectable value.');
    }
    await shippingAddress.selectOption(savedShippingAddressId);
    await expect(shippingAddress.locator('option:checked')).not.toHaveText(/new address/i);
    await page.locator('#shipping-buttons-container').getByRole('button', { name: 'Continue', exact: true }).click();

    console.log('Selecting an available delivery option');
    const deliveryOptions = page.locator('input[name="shippingoption"]');
    await expect(deliveryOptions.first()).toBeVisible();
    await deliveryOptions.first().check();
    await expect(deliveryOptions.first()).toBeChecked();
    await page.locator('#shipping-method-buttons-container').getByRole('button', { name: 'Continue', exact: true }).click();

    console.log('Selecting Cash on delivery when available, otherwise the first payment option');
    const cashOnDelivery = page.getByRole('radio', { name: /cash on delivery/i });
    if (await cashOnDelivery.count() > 0) {
        await cashOnDelivery.first().check();
        await expect(cashOnDelivery.first()).toBeChecked();
        console.log('Cash on delivery selected');
    } else {
        const paymentOptions = page.locator('input[name="paymentmethod"]');
        await expect(paymentOptions.first()).toBeVisible();
        await paymentOptions.first().check();
        await expect(paymentOptions.first()).toBeChecked();
        console.log('Cash on delivery is unavailable; selected the first available payment option');
    }
    await page.locator('#payment-method-buttons-container').getByRole('button', { name: 'Continue', exact: true }).click();

    console.log('Continuing through the payment information step');
    await page.locator('#payment-info-buttons-container').getByRole('button', { name: 'Continue', exact: true }).click();

    console.log('Confirming the order');
    await expect(page.getByRole('heading', { name: 'Confirm order', exact: true })).toBeVisible();
    await page.locator('#confirm-order-buttons-container').getByRole('button', { name: 'Confirm', exact: true }).click();
    //OrdersPage
    await expect(page).toHaveURL(/\/checkout\/completed/);
    await expect(page.getByText('Thank you', { exact: true })).toBeVisible();
    await expect(page.locator('strong')).toContainText('Your order has been successfully processed');
    const orderNumberItem = page.getByRole('listitem').filter({ hasText: /Order number:/i });
    await expect(orderNumberItem).toHaveCount(1);
    const orderNumberText = await orderNumberItem.innerText();
    const orderNumberMatch = orderNumberText.match(/Order number:\s*(\d+)/i);
    expect(orderNumberMatch).not.toBeNull();
    if (orderNumberMatch === null) {
        throw new Error(`Could not extract the order number from: ${orderNumberText}`);
    }
    const orderNumber = orderNumberMatch[1];
    console.log('Order number:', orderNumber);
});
