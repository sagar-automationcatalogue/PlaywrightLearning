import { expect, Locator, Page } from "@playwright/test";
import { TC_03_WebInputsFormValidations } from "../../test-data/expnadTesting";
import { expandTestingBaseURL, joinBaseURL } from "../config/EnvironmentConfig";
import { URLConfig } from "../config/URLConfig";
import { Constants } from "../constants/constants";

export class ExpandTesting_FormValidationPage {
    private page: Page;
    private contactName: Locator;
    private contactNumber: Locator;
    private pickupDate: Locator;
    private paymentMethod: Locator;
    private registerButton: Locator;
    private requiredContactNameMessage: Locator;
    private requiredContactNumberMessage: Locator;
    private requiredPickupDateMessage: Locator;
    private requiredPaymentMethodMessage: Locator;
    private successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contactName = page.locator('[name="ContactName"]');
        this.contactNumber = page.locator('[name="contactnumber"]');
        this.pickupDate = page.locator('[name="pickupdate"]');
        this.paymentMethod = page.locator('[name="payment"]');
        this.registerButton = page.getByRole("button", { name: " Register " });
        this.requiredContactNameMessage = page.getByText(            
            Constants.ExpandTesting.formValidation.requiredMessages.contactName
        );
        this.requiredContactNumberMessage = page.getByText(            
            Constants.ExpandTesting.formValidation.requiredMessages.contactNumber
        );
        this.requiredPickupDateMessage = page.getByText(            
            Constants.ExpandTesting.formValidation.requiredMessages.pickupDate
        );
        this.requiredPaymentMethodMessage = page.getByText(            
            Constants.ExpandTesting.formValidation.requiredMessages.paymentMethod
        );
        this.successMessage = page.getByText(Constants.ExpandTesting.formValidation.successMessage);
    }

    async openAndVerifyRequiredFieldValidation(): Promise<void> {
        await this.page.goto(joinBaseURL(expandTestingBaseURL, URLConfig.UI.ExpandTesting.formValidationURL));
        await expect(this.page).toHaveURL(joinBaseURL(expandTestingBaseURL, URLConfig.UI.ExpandTesting.formValidationURL));
        await this.contactName.fill(TC_03_WebInputsFormValidations.emptyValue);
        await this.contactNumber.fill(TC_03_WebInputsFormValidations.emptyValue);
        await this.pickupDate.fill(TC_03_WebInputsFormValidations.emptyValue);
        await expect(this.contactName).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
        await expect(this.contactNumber).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
        await expect(this.pickupDate).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
        await expect(this.paymentMethod).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
        await this.registerButton.click();
        await expect(this.requiredContactNameMessage).toBeVisible();
        await expect(this.requiredContactNumberMessage).toBeVisible();
        await expect(this.requiredPickupDateMessage).toBeVisible();
        await expect(this.requiredPaymentMethodMessage).toBeVisible();
        console.log("fields required messages are displayed");
    }

    async enterValidDetailsAndSubmit(): Promise<void> {
        await this.contactName.fill(TC_03_WebInputsFormValidations.formValidation.contactName);
        await expect(this.contactName).toHaveValue(TC_03_WebInputsFormValidations.formValidation.contactName);
        await this.contactNumber.fill(TC_03_WebInputsFormValidations.formValidation.contactNumber);
        await expect(this.contactNumber).toHaveValue(TC_03_WebInputsFormValidations.formValidation.contactNumber);
        await this.pickupDate.fill(TC_03_WebInputsFormValidations.formValidation.pickupDate);
        await expect(this.pickupDate).toHaveValue(TC_03_WebInputsFormValidations.formValidation.pickupDate);
        await this.paymentMethod.selectOption(TC_03_WebInputsFormValidations.formValidation.paymentMethod);
        await expect(this.paymentMethod).toHaveValue(TC_03_WebInputsFormValidations.formValidation.paymentMethod);

        await this.registerButton.click();
        console.log("form is submitted with all valid details");
        await expect(this.successMessage).toBeVisible();
    }
}
