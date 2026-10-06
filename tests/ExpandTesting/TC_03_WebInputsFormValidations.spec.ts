import {expect,test} from "@playwright/test";
/** Developed by Surekha - Incomplete */
test(`TC 03 Validating web inputs and form `,async({page,browserName})=>{
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
    await numberInput.fill(`12345`);
    await textInput.fill(`Playwright Automation`);
    await passwordInput.fill(`Automation@123`);
    await dateInput.fill(`2026-09-15`);
    await expect(numberInput).toHaveValue(`12345`);
    await expect(textInput).toHaveValue(`Playwright Automation`);
    await expect(passwordInput).toHaveValue(`Automation@123`);
    await expect(dateInput).toHaveValue(`2026-09-15`);

    // Steps 7-11: Display and verify each submitted value.
    await page.getByRole(`button`,{name:`Display Inputs`}).click();
    await expect(page.locator(`#output-number`)).toHaveText(`12345`);
    await expect(page.locator(`#output-text`)).toHaveText(`Playwright Automation`);
    await expect(page.locator(`#output-password`)).toHaveText(`Automation@123`);
    await expect(page.locator(`#output-date`)).toHaveText(`2026-09-15`);

    // Steps 12-13: Clear and verify every input is empty.
    await page.getByRole(`button`,{name:`Clear Inputs`}).click();
    await expect(numberInput).toHaveValue(``);
    await expect(textInput).toHaveValue(``);
    await expect(passwordInput).toHaveValue(``);
    await expect(dateInput).toHaveValue(``);

    // Steps 14-19: Open Form Validation and verify required-field errors.
    await page.goto(`https://practice.expandtesting.com/form-validation`);
    await expect(page).toHaveURL(`https://practice.expandtesting.com/form-validation`);
    const contactName = page.locator(`[name="ContactName"]`);
    const contactNumber = page.locator(`[name="contactnumber"]`);
    const pickupDate = page.locator(`[name="pickupdate"]`);
    const paymentMethod = page.locator(`[name="payment"]`);
    await contactName.fill(``);
    await contactNumber.fill(``);
    await pickupDate.fill(``);
    await expect(contactName).toHaveValue(``);
    await expect(contactNumber).toHaveValue(``);
    await expect(pickupDate).toHaveValue(``);
    await expect(paymentMethod).toHaveValue(``);
    await page.getByRole(`button`,{name:` Register `}).click();
    await expect(page.getByText(`Please enter your Contact name.`)).toBeVisible();
    await expect(page.getByText(`Please provide your Contact number.`)).toBeVisible();
    await expect(page.getByText(`Please provide valid Date.`)).toBeVisible();
    await expect(page.getByText(`Please select the Paymeny Method.`)).toBeVisible();

    console.log(`fields required messages are displayed`);

    // Steps 20-23: Enter valid contact details, pickup date, and payment method.
    await contactName.fill(`Playwright Student`);
    await expect(contactName).toHaveValue(`Playwright Student`);
    await contactNumber.fill(`012-3456789`);
    await expect(contactNumber).toHaveValue(`012-3456789`);
    await pickupDate.fill(`2026-09-20`);
    await expect(pickupDate).toHaveValue(`2026-09-20`);
    await paymentMethod.selectOption(`cashondelivery`);
    await expect(paymentMethod).toHaveValue(`cashondelivery`);

    // Steps 24-25: Submit valid details and verify successful form state.
    await page.getByRole(`button`,{name:` Register `}).click();
    console.log(`form is submitted with all valid details`);

    await expect(page.getByText(`Thank you for validating your ticket`)).toBeVisible();
    
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
    await simpleDropdown.selectOption(`1`);
    await elementsPerPage.selectOption(`100`);
    await countryDropdown.selectOption(`IN`);
    await expect(simpleDropdown).toHaveValue(`1`);
    await expect(elementsPerPage).toHaveValue(`100`);
    await expect(countryDropdown).toHaveValue(`IN`);
    console.log(`selected values are displayed`);




    

})