import {expect,test} from "@playwright/test";

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

    await page.goto(`https://practice.expandtesting.com/inputs`);
    await expect(page.getByLabel(`Input: Number`).isVisible);
    await expect(page.getByLabel(`Input: Text`).isVisible());
    await expect(page.getByLabel(`Input: Password`).isVisible());
    await expect(page.getByLabel(`Input: Date`).isVisible());

    console.log(`Display input fields are visible`)

    await page.getByLabel(`Input: Number`).fill(`12345`);
    await page.getByLabel(`Input: Text`).fill(`Playwright Automation`);
    await page.getByLabel(`Input: Password`).fill(`Automation@123`);
    await page.getByLabel(`Input: Date`).fill(`2026-09-15`);

    await page.getByRole(`button`,{name:`Display Inputs`}).click();
    await expect(page.locator(`#output-number`)).toHaveText(`12345`);
    await expect(page.locator(`#output-text`)).toHaveText(`Playwright Automation`);
    await expect(page.locator(`#output-password`)).toHaveText(`Automation@123`);
    await expect(page.locator(`#output-date`)).toHaveText(`2026-09-15`);

    await page.getByRole(`button`,{name:`Clear Inputs`}).click();
    await expect(await page.getByLabel(`Input: Number`).inputValue()).toBe(``);
    await expect(await page.getByLabel(`Input: Text`).inputValue()).toBe(``);
    await expect(await page.getByLabel(`Input: Password`).inputValue()).toBe(``);
    await expect(await page.getByLabel(`Input: Date`).inputValue()).toBe(``);

    //naviagating to form validation
    await page.goto(`https://practice.expandtesting.com/form-validation`);
    await page.locator(`//input[@name='ContactName']`).clear();
    await page.getByRole(`button`,{name:` Register `}).click();
    await expect(page.getByText(`Please enter your Contact name.`)).toBeVisible();
    await expect(page.getByText(`Please provide your Contact number.`)).toBeVisible();
    await expect(page.getByText(`Please provide valid Date.`)).toBeVisible();
    await expect(page.getByText(`Please select the Paymeny Method.`)).toBeVisible();

    console.log(`fields required messages are displayed`);

    await page.locator(`//input[@name='ContactName']`).fill(`Playwright Student`);
    await expect(page.locator(`//input[@name='ContactName']`)).toHaveValue(`Playwright Student`);
    await page.locator(`//input[@name='contactnumber']`).fill(`012-3456789`);
    await expect(page.locator(`//input[@name='contactnumber']`)).toHaveValue(`012-3456789`);
    await page.locator(`//input[@name='pickupdate']`).fill(`2026-09-20`);
    await expect(page.locator(`//input[@name='pickupdate']`)).toHaveValue(`2026-09-20`);
    await page.locator(`//select[@name='payment']`).selectOption(`cashondelivery`)
    await expect(page.locator(`//select[@name='payment']`)).toHaveValue(`cashondelivery`);
    await page.getByRole(`button`,{name:` Register `}).click();
    console.log(`form is submitted with all valid details`);

    await expect(page.getByText(`Thank you for validating your ticket`)).toBeVisible();
    
    //navigating to radio buttons page

    await page.goto(`https://practice.expandtesting.com/radio-buttons`);
    await page.locator(`#red`).click();
    await page.locator(`#football`).click();    
    await expect(page.locator(`#red`)).toBeChecked();
    await expect(page.locator(`#blue`)).not.toBeChecked();
    await expect(page.locator(`#yellow`)).not.toBeChecked();
    await expect(page.locator(`#black`)).not.toBeChecked();
    await expect(page.locator(`#green`)).not.toBeChecked();
    console.log(`only one color is selected`)
    await expect(page.locator(`#football`)).toBeChecked();
    await expect(page.locator(`#basketball`)).not.toBeChecked();
    await expect(page.locator(`#tennis`)).not.toBeChecked();
    console.log(`only one sport is selected`)

    //navigating to checkboxes validation

    await page.goto(`https://practice.expandtesting.com/checkboxes`);
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

    //navigating to dropdown page
    await page.goto(`https://practice.expandtesting.com/dropdown`);
    await page.locator(`//select[@id='dropdown']`).selectOption(`1`);
    await page.locator(`#elementsPerPageSelect`).selectOption(`100`);
    await page.locator(`//select[@id='country']`).selectOption(`IN`);
    await expect(page.locator(`//select[@id='dropdown']`)).toHaveValue(`1`);
    await expect(page.locator(`#elementsPerPageSelect`)).toHaveValue(`100`);
    await expect(page.locator(`//select[@id='country']`)).toHaveValue(`IN`);
    console.log(`selected values are displayed`);




    

})