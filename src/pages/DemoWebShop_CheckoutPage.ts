import { Locator, Page,expect } from "@playwright/test";

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

    async selectBillingAddress(): Promise<void>{
        console.log('Selecting the existing billing address');        
        await expect(this.billingAddress).toBeVisible();        
        await expect(this.savedBillingAddresses.first()).toBeAttached();
        const savedBillingAddressId = await this.savedBillingAddresses.first().getAttribute('value');
        if (savedBillingAddressId === null) {
            throw new Error('The saved billing address does not have a selectable value.');
        }
        await this.billingAddress.selectOption(savedBillingAddressId);
        await expect(this.selectedBillingAddress).not.toHaveText(/new address/i);
        await this.billingContinueBtn.click();
    }

    async selectShippingAddress(): Promise<void>{
        console.log('Selecting the existing shipping address');        
        await expect(this.shippingAddress).toBeVisible();        
        await expect(this.savedShippingAddresses.first()).toBeAttached();
        const savedShippingAddressId = await this.savedShippingAddresses.first().getAttribute('value');
        if (savedShippingAddressId === null) {
            throw new Error('The saved shipping address does not have a selectable value.');
        }
        await this.shippingAddress.selectOption(savedShippingAddressId);
        await expect(this.selectedShippingAddress).not.toHaveText(/new address/i);
        await this.shippingContinueBtn.click();
    }

    async selectDeliveryOption(): Promise<void>{
        console.log('Selecting an available delivery option');        
        await expect(this.deliveryOptions.first()).toBeVisible();
        await this.deliveryOptions.first().check();
        await expect(this.deliveryOptions.first()).toBeChecked();
        await this.shippingMethodContinueBtn.click();
    }

    async selectPaymentOption(): Promise<void>{
        console.log('Selecting Cash on delivery when available, otherwise the first payment option');
        
        if (await this.cashOnDelivery.count() > 0) {
            await this.cashOnDelivery.first().check();
            await expect(this.cashOnDelivery.first()).toBeChecked();
            console.log('Cash on delivery selected');
        } else {            
            await expect(this.paymentOptions.first()).toBeVisible();
            await this.paymentOptions.first().check();
            await expect(this.paymentOptions.first()).toBeChecked();
            console.log('Cash on delivery is unavailable; selected the first available payment option');
        }
        await this.paymentMethodContinueBtn.click();
        console.log('Continuing through the payment information step');
        await this.paymentInfoContinueBtn.click();
    }

    async confirmOrder(): Promise<void>{
        console.log('Confirming the order');
        await expect(this.confirmOrderHdr).toBeVisible();
        await this.confirmOrderBtn.click()
    }

}