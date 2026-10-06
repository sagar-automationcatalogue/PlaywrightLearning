import {expect,test} from "@playwright/test";
/** Developed by Surekha - Incomplete */

const TC_03_WebInputsFormValidations = {    
    emptyValue: ``,
    inputs: {
        number: `12345`,
        text: `Playwright Automation`,
        password: `Automation@123`,
        date: `2026-09-15`
    },
    formValidation: {
        contactName: `Playwright Student`,
        contactNumber: `012-3456789`,
        pickupDate: `2026-09-20`,
        paymentMethod: `cashondelivery`,
        requiredMessages: {
            contactName: `Please enter your Contact name.`,
            contactNumber: `Please provide your Contact number.`,
            pickupDate: `Please provide valid Date.`,
            paymentMethod: `Please select the Paymeny Method.`
        },
        successMessage: `Thank you for validating your ticket`
    },
    dropdownValues: {
        simple: `1`,
        elementsPerPage: `100`,
        country: `IN`
    }
};

test(`@regression TC_03_WebInputsFormValidation:`,async({page,browserName})=>{
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

    // Steps 1-2: Open Web Inputs and verify all four input types.
    await page.goto(`https://practice.expandtesting.com/inputs`);
    await expect(page).toHaveURL(`https://practice.expandtesting.com/inputs`);
    const numberInput = page.getByLabel(`Input: Number`);
    const textInput = page.getByLabel(`Input: Text`);
    const passwordInput = page.getByLabel(`Input: Password`);
    const dateInput = page.getByLabel(`Input: Date`);
    await expect(numberInput).toBeVisible();
    await expect(textInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(dateInput).toBeVisible();

    console.log(`Display input fields are visible`)

    // Steps 3-6: Enter and verify the supplied input values.
    await numberInput.fill(TC_03_WebInputsFormValidations.inputs.number);
    await textInput.fill(TC_03_WebInputsFormValidations.inputs.text);
    await passwordInput.fill(TC_03_WebInputsFormValidations.inputs.password);
    await dateInput.fill(TC_03_WebInputsFormValidations.inputs.date);
    await expect(numberInput).toHaveValue(TC_03_WebInputsFormValidations.inputs.number);
    await expect(textInput).toHaveValue(TC_03_WebInputsFormValidations.inputs.text);
    await expect(passwordInput).toHaveValue(TC_03_WebInputsFormValidations.inputs.password);
    await expect(dateInput).toHaveValue(TC_03_WebInputsFormValidations.inputs.date);

    // Steps 7-11: Display and verify each submitted value.
    await page.getByRole(`button`,{name:`Display Inputs`}).click();
    await expect(page.locator(`#output-number`)).toHaveText(TC_03_WebInputsFormValidations.inputs.number);
    await expect(page.locator(`#output-text`)).toHaveText(TC_03_WebInputsFormValidations.inputs.text);
    await expect(page.locator(`#output-password`)).toHaveText(TC_03_WebInputsFormValidations.inputs.password);
    await expect(page.locator(`#output-date`)).toHaveText(TC_03_WebInputsFormValidations.inputs.date);

    // Steps 12-13: Clear and verify every input is empty.
    await page.getByRole(`button`,{name:`Clear Inputs`}).click();
    await expect(numberInput).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
    await expect(textInput).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
    await expect(passwordInput).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
    await expect(dateInput).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);

    // Steps 14-19: Open Form Validation and verify required-field errors.
    await page.goto(`https://practice.expandtesting.com/form-validation`);
    await expect(page).toHaveURL(`https://practice.expandtesting.com/form-validation`);
    const contactName = page.locator(`[name="ContactName"]`);
    const contactNumber = page.locator(`[name="contactnumber"]`);
    const pickupDate = page.locator(`[name="pickupdate"]`);
    const paymentMethod = page.locator(`[name="payment"]`);
    await contactName.fill(TC_03_WebInputsFormValidations.emptyValue);
    await contactNumber.fill(TC_03_WebInputsFormValidations.emptyValue);
    await pickupDate.fill(TC_03_WebInputsFormValidations.emptyValue);
    await expect(contactName).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
    await expect(contactNumber).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
    await expect(pickupDate).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
    await expect(paymentMethod).toHaveValue(TC_03_WebInputsFormValidations.emptyValue);
    await page.getByRole(`button`,{name:` Register `}).click();
    await expect(page.getByText(TC_03_WebInputsFormValidations.formValidation.requiredMessages.contactName)).toBeVisible();
    await expect(page.getByText(TC_03_WebInputsFormValidations.formValidation.requiredMessages.contactNumber)).toBeVisible();
    await expect(page.getByText(TC_03_WebInputsFormValidations.formValidation.requiredMessages.pickupDate)).toBeVisible();
    await expect(page.getByText(TC_03_WebInputsFormValidations.formValidation.requiredMessages.paymentMethod)).toBeVisible();

    console.log(`fields required messages are displayed`);

    // Steps 20-23: Enter valid contact details, pickup date, and payment method.
    await contactName.fill(TC_03_WebInputsFormValidations.formValidation.contactName);
    await expect(contactName).toHaveValue(TC_03_WebInputsFormValidations.formValidation.contactName);
    await contactNumber.fill(TC_03_WebInputsFormValidations.formValidation.contactNumber);
    await expect(contactNumber).toHaveValue(TC_03_WebInputsFormValidations.formValidation.contactNumber);
    await pickupDate.fill(TC_03_WebInputsFormValidations.formValidation.pickupDate);
    await expect(pickupDate).toHaveValue(TC_03_WebInputsFormValidations.formValidation.pickupDate);
    await paymentMethod.selectOption(TC_03_WebInputsFormValidations.formValidation.paymentMethod);
    await expect(paymentMethod).toHaveValue(TC_03_WebInputsFormValidations.formValidation.paymentMethod);

    // Steps 24-25: Submit valid details and verify successful form state.
    await page.getByRole(`button`,{name:` Register `}).click();
    console.log(`form is submitted with all valid details`);

    await expect(page.getByText(TC_03_WebInputsFormValidations.formValidation.successMessage)).toBeVisible();
    
    // Steps 26-30: Select Blue and Tennis and verify radio-group exclusivity.
    await page.goto(`https://practice.expandtesting.com/radio-buttons`);
    await expect(page).toHaveURL(`https://practice.expandtesting.com/radio-buttons`);
    await page.locator(`#blue`).check();
    await page.locator(`#tennis`).check();
    await expect(page.locator(`#blue`)).toBeChecked();
    await expect(page.locator(`#red`)).not.toBeChecked();
    await expect(page.locator(`#yellow`)).not.toBeChecked();
    await expect(page.locator(`#black`)).not.toBeChecked();
    await expect(page.locator(`#green`)).not.toBeChecked();
    console.log(`only one color is selected`)
    await expect(page.locator(`#tennis`)).toBeChecked();
    await expect(page.locator(`#football`)).not.toBeChecked();
    await expect(page.locator(`#basketball`)).not.toBeChecked();
    console.log(`only one sport is selected`)

    // Steps 31-35: Set and toggle both checkboxes, verifying each state.
    await page.goto(`https://practice.expandtesting.com/checkboxes`);
    await expect(page).toHaveURL(`https://practice.expandtesting.com/checkboxes`);
    await page.locator(`#checkbox1`).check();
    await page.locator(`#checkbox2`).uncheck();
    await expect(page.locator(`#checkbox1`)).toBeChecked();
    await expect(page.locator(`#checkbox2`)).not.toBeChecked();
    console.log(`now toggle the checkboxes`);
    await page.locator(`#checkbox1`).uncheck();
    await page.locator(`#checkbox2`).check();
    await expect(page.locator(`#checkbox1`)).not.toBeChecked();
    await expect(page.locator(`#checkbox2`)).toBeChecked();
    console.log(`checkboxes interaction is working.`);

    // Steps 36-40: Select dropdown values and verify each selected value.
    await page.goto(`https://practice.expandtesting.com/dropdown`);
    await expect(page).toHaveURL(`https://practice.expandtesting.com/dropdown`);
    const simpleDropdown = page.locator(`#dropdown`);
    const elementsPerPage = page.locator(`#elementsPerPageSelect`);
    const countryDropdown = page.locator(`#country`);
    await simpleDropdown.selectOption(TC_03_WebInputsFormValidations.dropdownValues.simple);
    await elementsPerPage.selectOption(TC_03_WebInputsFormValidations.dropdownValues.elementsPerPage);
    await countryDropdown.selectOption(TC_03_WebInputsFormValidations.dropdownValues.country);
    await expect(simpleDropdown).toHaveValue(TC_03_WebInputsFormValidations.dropdownValues.simple);
    await expect(elementsPerPage).toHaveValue(TC_03_WebInputsFormValidations.dropdownValues.elementsPerPage);
    await expect(countryDropdown).toHaveValue(TC_03_WebInputsFormValidations.dropdownValues.country);
    console.log(`selected values are displayed`);




    

})