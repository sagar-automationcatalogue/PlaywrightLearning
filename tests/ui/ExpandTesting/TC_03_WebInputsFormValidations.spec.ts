import { test } from "@playwright/test";
import { ExpandTesting_WebInputsPage } from "../../../src/pages/ExpandTesting_WebInputsPage";
import { ExpandTesting_FormValidationPage } from "../../../src/pages/ExpandTesting_FormValidationPage";
import { ExpandTesting_RadioButtonsPage } from "../../../src/pages/ExpandTesting_RadioButtonsPage";
import { ExpandTesting_CheckboxesPage } from "../../../src/pages/ExpandTesting_CheckboxesPage";
import { ExpandTesting_DropdownPage } from "../../../src/pages/ExpandTesting_DropdownPage";
import { expandTestingBaseURL, joinBaseURL } from "../../../src/config/EnvironmentConfig";
import { URLConfig } from "../../../src/config/URLConfig";
import { PlaywrightUtils } from "../../../src/utils/PlaywrightUtils";

/** Developed by Surekha - Incomplete */
test(`@regression TC_03_WebInputsFormValidation:`, async ({ page, browserName }) => {
    const webInputsPage = new ExpandTesting_WebInputsPage(page);
    const formValidationPage = new ExpandTesting_FormValidationPage(page);
    const radioButtonsPage = new ExpandTesting_RadioButtonsPage(page);
    const checkboxesPage = new ExpandTesting_CheckboxesPage(page);
    const dropdownPage = new ExpandTesting_DropdownPage(page);

    if (browserName === "webkit") {
        //test.slow();
        test.setTimeout(90_000);
    }

    // Ignore third-party ads before navigating to any page.
    await page.route("**/*", async (route) => {
        const url = route.request().url();
        if (
            url.includes("googleads") ||
            url.includes("googlesyndication") ||
            url.includes("doubleclick") ||
            url.includes("googletagservices") ||
            url.includes("adservice.google") ||
            url.includes("google_vignette")
        ) {
            await route.abort();
        } else {
            await route.continue();
        }
    });

    await PlaywrightUtils.navigateToURL(
        page,
        joinBaseURL(expandTestingBaseURL, URLConfig.UI.ExpandTesting.inputsURL)
    );
    await webInputsPage.openAndVerifyInputs();
    await webInputsPage.enterDisplayAndClearInputValues();
    await formValidationPage.openAndVerifyRequiredFieldValidation();
    await formValidationPage.enterValidDetailsAndSubmit();
    await radioButtonsPage.selectColorAndSportAndVerifyExclusivity();
    await checkboxesPage.toggleCheckboxesAndVerifyStates();
    await dropdownPage.selectDropdownValuesAndVerify();
});
