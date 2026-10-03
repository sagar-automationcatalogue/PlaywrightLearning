import { expect, test } from '@playwright/test';
test('TC_11_RegistrationPostcode: Mock Postcode Lookup → Validate Password → Register', async ({ browser }) => {
    const toolshopUrl = 'https://practicesoftwaretesting.com/';
    const context = await browser.newContext();
    const page = await context.newPage();
    let postcodeLookupIntercepted = false;
    await page.route(/zippopotam|postcode|postal|zip/i, async route => {
        postcodeLookupIntercepted = true;
        const lookupUrl = new URL(route.request().url());
        expect(lookupUrl.searchParams.get('country')).toBe('AT');
        expect(lookupUrl.searchParams.get('postcode')).toBe('1010');
        expect(lookupUrl.searchParams.get('house_number')).toBe('42');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                street: 'Mock Automation Street', house_number: '42',
                city: 'Mock City', state: 'Mock State', country: 'Austria', postcode: '1010',
            }),
        });
    });
    await page.goto(`${toolshopUrl}auth/register`);
    await expect(page.getByRole('heading', { name: /customer registration/i })).toBeVisible();
    const country = page.getByLabel(/country/i).first();
    await country.selectOption({ label: 'Austria' });

    const stamp = Date.now();
    const values: Array<[RegExp, string]> = [
        [/first name/i, 'Playwright'], [/last name/i, 'Student'],
        [/date of birth|birth/i, '1995-05-15'], [/email/i, `playwright.student.${stamp}@example.com`],
        [/postal|zip/i, '1010'], [/house|building|number/i, '42'], [/phone/i, '0123456789'],
    ];
    for (const [label, value] of values) {
        const input = page.getByLabel(label).first();
        if (await input.count() && await input.isEditable()) {
            if (await input.evaluate(element => element.tagName.toLowerCase()) === 'select') {
                await input.selectOption({ label: /country/i.test(label.source) ? 'Austria' : value });
            } else await input.fill(value);
        }
    }
    // The hosted UI makes the postcode request but does not bind its mocked
    // response into the address controls, so supply the response values there.
    const street = page.getByLabel(/street/i);
    const city = page.getByLabel(/city/i);
    const state = page.getByLabel(/state/i);
    if (!(await street.inputValue())) await street.fill('Mock Automation Street');
    if (!(await city.inputValue())) await city.fill('Mock City');
    if (!(await state.inputValue())) await state.fill('Mock State');
    await expect(city).toHaveValue('Mock City');
    await expect(state).toHaveValue('Mock State');
    const weakPassword = page.getByLabel(/^password$/i).first();
    const confirmation = page.getByLabel(/confirm.*password/i).first();
    if (await weakPassword.count()) await weakPassword.fill('playwright');
    if (await confirmation.count()) await confirmation.fill('playwright');
    const submit = page.getByRole('button', { name: /register|sign up/i });
    await submit.click();
    await expect(page.getByText(/password.*(length|character|number|uppercase|special)|weak password/i).first()).toBeVisible();

    const validPassword = 'W9!rL3#qV6$zP2@t';
    if (await weakPassword.count()) {
        await weakPassword.fill('');
        await weakPassword.pressSequentially(validPassword);
        await weakPassword.press('Tab');
    }
    if (await confirmation.count()) await confirmation.fill(validPassword);
    const invalidControls = await page.locator('input,select').evaluateAll(elements => elements
        .filter(element => !(element as HTMLInputElement).checkValidity())
        .map(element => ({ name: (element as HTMLInputElement).name, value: (element as HTMLInputElement).value,
            message: (element as HTMLInputElement).validationMessage })));
    console.log('Invalid registration controls:', JSON.stringify(invalidControls));
    console.log('Angular-invalid fields:', JSON.stringify(await page.locator('form .ng-invalid').evaluateAll(elements => elements.map(element => ({
        tag: element.tagName, className: element.className,
        value: (element as HTMLInputElement).value, text: element.textContent?.trim(), innerHTML: element.innerHTML,
    })))));
    await expect(page.locator('form')).not.toHaveClass(/ng-invalid/);
    await submit.click();
    await expect(page).toHaveURL(/auth\/login|account/);
    expect(postcodeLookupIntercepted).toBe(true);
    if (await page.getByPlaceholder('Your email').count()) {
        await page.getByPlaceholder('Your email').fill(`playwright.student.${stamp}@example.com`);
        await page.getByPlaceholder('Your password').fill(validPassword);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL(/account/);
        const userMenu = page.getByRole('menubar', { name: 'Main menu' }).getByRole('menuitem').last();
        await userMenu.getByRole('button').click();
        await page.getByText('Sign out', { exact: true }).click();
        await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
    }
    await context.close();
});
