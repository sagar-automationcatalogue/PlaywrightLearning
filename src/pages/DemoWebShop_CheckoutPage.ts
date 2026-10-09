import { Locator, Page } from "@playwright/test";

export class DemoWebShop_CheckoutPage {
    private billingAddress: Locator;
    private savedBillingAddresses: Locator;
    private selectedBillingAddress: Locator;
    private billingContinueBtn: Locator;
    private shippingAddress: Locator;
    private savedShippingAddresses: Locator;
    private selectedShippingAddress: Locator;
    private shippingContinueBtn: Locator;
    private deliveryOptions: Locator;
    private shippingMethodContinueBtn: Locator;
    private cashOnDelivery: Locator;
    private paymentOptions: Locator;
    private paymentMethodContinueBtn: Locator;
    private paymentInfoContinueBtn: Locator;
    private confirmOrderHdr: Locator;
    private confirmOrderBtn: Locator;

    constructor(page: Page) {
        this.billingAddress = page.locator('#billing-address-select');
        this.savedBillingAddresses = this.billingAddress.locator('option').filter({ hasNotText: /new address/i });
        this.selectedBillingAddress = this.billingAddress.locator('option:checked');
        this.billingContinueBtn = page.locator('#billing-buttons-container').getByRole('button', { name: 'Continue', exact: true });

        this.shippingAddress = page.locator('#shipping-address-select');
        this.savedShippingAddresses = this.shippingAddress.locator('option').filter({ hasNotText: /new address/i });
        this.selectedShippingAddress = this.shippingAddress.locator('option:checked');
        this.shippingContinueBtn = page.locator('#shipping-buttons-container').getByRole('button', { name: 'Continue', exact: true });

        this.deliveryOptions = page.locator('input[name="shippingoption"]');
        this.shippingMethodContinueBtn = page.locator('#shipping-method-buttons-container').getByRole('button', { name: 'Continue', exact: true });

        this.cashOnDelivery = page.getByRole('radio', { name: /cash on delivery/i });
        this.paymentOptions = page.locator('input[name="paymentmethod"]');
        this.paymentMethodContinueBtn = page.locator('#payment-method-buttons-container').getByRole('button', { name: 'Continue', exact: true });
        this.paymentInfoContinueBtn = page.locator('#payment-info-buttons-container').getByRole('button', { name: 'Continue', exact: true });

        this.confirmOrderHdr = page.getByRole('heading', { name: 'Confirm order', exact: true });
        this.confirmOrderBtn = page.locator('#confirm-order-buttons-container').getByRole('button', { name: 'Confirm', exact: true });
    }
}