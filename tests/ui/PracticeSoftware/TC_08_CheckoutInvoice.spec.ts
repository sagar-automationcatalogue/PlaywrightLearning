import { expect, test } from '@playwright/test';
import { TC_08_CheckoutInvoice } from '../../../test-data/practiceSoftware.ts';

test('@regression TC_08_CheckoutInvoice: Validate Payment → Place Order → Inspect Invoice', async ({ page }) => {
    const toolshopUrl = 'https://practicesoftwaretesting.com/';
    await page.goto(`${toolshopUrl}checkout`);
    const existingItems = page.locator('tr').filter({ has: page.locator('input[type="number"]') });
    while (await existingItems.count()) {
        const remove = existingItems.first().getByRole('button', { name: /remove|delete/i });
        if (!(await remove.count())) break;
        await remove.click();
    }

    await page.goto(toolshopUrl);
    await expect(page.getByRole('menubar', { name: 'Main menu' })).toBeVisible();
    await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);
    await page.getByRole('textbox', { name: 'Search' }).fill(TC_08_CheckoutInvoice.productName);
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByRole('heading', { name: new RegExp(`searched for: ${TC_08_CheckoutInvoice.productName}`, 'i') })).toBeVisible();
    await page.locator('.card:visible').filter({ has: page.getByRole('heading', { name: TC_08_CheckoutInvoice.productName, exact: true }) }).getByRole('heading', { name: TC_08_CheckoutInvoice.productName, exact: true }).click();
    await expect(page).toHaveURL(/\/product\//);
    const quantity = page.getByRole('spinbutton');
    if (await quantity.count()) await quantity.fill(TC_08_CheckoutInvoice.quantity);
    await page.getByRole('button', { name: /add to cart/i }).click();
    const cartLink = page.getByRole('link', { name: /^cart\s*\d*$/i });
    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await expect(page).toHaveURL(/checkout/);
    await expect(page.getByRole('row').filter({ hasText: TC_08_CheckoutInvoice.productName })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed to checkout' }).click();
    const loginEmail = page.getByPlaceholder('Your email');
    const alreadyLoggedIn = page.getByText(/you are already logged in/i);
    const signedInMenuButton = page.getByRole('menubar', { name: 'Main menu' })
        .getByRole('menuitem').last().getByRole('button');
    if (!(await alreadyLoggedIn.count()) && !(await signedInMenuButton.count())
        && await loginEmail.first().isVisible().catch(() => false)) {
        await loginEmail.first().fill(TC_08_CheckoutInvoice.accountEmail);
        await page.getByPlaceholder('Your password').first().fill(TC_08_CheckoutInvoice.accountPassword);
        await page.getByRole('button', { name: 'Login' }).click();
    }
    const advanceCheckout = page.getByRole('button', { name: 'Proceed to checkout' });
    await expect(advanceCheckout).toBeVisible();
    await advanceCheckout.click();
    await expect(page.getByLabel(/street/i).first()).toBeVisible();

    const addressFields: Array<[RegExp, string]> = [
        [/street|address/i, TC_08_CheckoutInvoice.shippingAddress.street],
        [/city/i, TC_08_CheckoutInvoice.shippingAddress.city],
        [/state|province/i, TC_08_CheckoutInvoice.shippingAddress.state],
        [/country/i, TC_08_CheckoutInvoice.shippingAddress.country],
        [/postal|zip/i, TC_08_CheckoutInvoice.shippingAddress.postcode],
        [/house number/i, TC_08_CheckoutInvoice.shippingAddress.houseNumber],
    ];
    for (const [label, value] of addressFields) {
        const field = page.getByLabel(label).first();
        if (await field.count() && await field.isVisible() && await field.isEditable()) {
            if (await field.evaluate(element => element.tagName.toLowerCase()) === 'select') await field.selectOption({ label: value });
            else await field.fill(value);
        }
    }
    const next = page.getByRole('button', { name: /continue|next/i });
    if (await next.count()) await next.first().click();
    else {
        const billingNext = page.getByRole('button', { name: 'Proceed to checkout' });
        await expect(billingNext).toBeEnabled();
        await billingNext.click();
    }

    const paymentMethod = page.getByLabel(/payment method/i);
    await paymentMethod.selectOption({ label: TC_08_CheckoutInvoice.paymentMethod });
    const checkPayment = page.getByRole('button', { name: /check payment/i });
    await expect(checkPayment).toBeEnabled();
    await checkPayment.click();
    const confirmOrder = page.getByRole('button', { name: 'Confirm', exact: true });
    await expect(confirmOrder).toBeEnabled();
    await confirmOrder.click();
    // The hosted app validates payment here and displays the payment result;
    // it leaves the wizard on the Payment step instead of creating an order.
    await expect(page.getByText('Payment was successful', { exact: true })).toBeVisible();

    const invoiceMenu = page.getByRole('menubar', { name: 'Main menu' });
    const menuButton = invoiceMenu.getByRole('button').last();
    await menuButton.click();
    await invoiceMenu.getByRole('link', { name: /my invoices/i }).click();
    await expect(page).toHaveURL(/account\/invoices/);
    await expect(page.getByRole('heading', { name: /invoices/i }).first()).toBeVisible();
});
