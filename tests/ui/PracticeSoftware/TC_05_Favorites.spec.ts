import { expect, test } from '@playwright/test';
import { TC_05_Favorites } from '../../../test-data/practiceSoftware.ts';

test('@sanity TC_05_Favorites: Add Multiple Products → Validate → Remove', async ({ page }) => {
    const toolshopUrl = 'https://practicesoftwaretesting.com/';
    const email = TC_05_Favorites.email;
    const password = TC_05_Favorites.password;
    await page.goto(`${toolshopUrl}auth/register`);
    await expect(page.getByRole('heading', { name: /customer registration/i })).toBeVisible();
    if (await page.getByRole('heading', { name: /customer registration/i }).count()) {
        await page.route(/zippopotam|postcode|postal|zip/i, async route => {
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
                street: 'Playwright Training Street', house_number: '42', city: 'Vienna',
                state: 'Vienna', country: 'Austria', postcode: '1010',
            }) });
        });
        await page.getByLabel(/country/i).first().selectOption({ label: TC_05_Favorites.registration.country });
        const registrationValues: Array<[RegExp, string]> = [
            [/first name/i, TC_05_Favorites.registration.firstName], [/last name/i, TC_05_Favorites.registration.lastName],
            [/date of birth|birth/i, TC_05_Favorites.registration.dateOfBirth], [/email/i, email],
            [/postal|zip/i, TC_05_Favorites.registration.postcode], [/house|building|number/i, TC_05_Favorites.registration.houseNumber],
            [/phone/i, TC_05_Favorites.registration.phone],
        ];
        for (const [label, value] of registrationValues) {
            const field = page.getByLabel(label).first();
            if (await field.count() && await field.isEditable()) await field.fill(value);
        }
        await page.getByLabel(/street/i).fill(TC_05_Favorites.registration.street);
        const registrationCity = page.getByLabel(/city/i);
        const registrationState = page.getByLabel(/state/i);
        if (!(await registrationCity.inputValue())) await registrationCity.fill(TC_05_Favorites.registration.city);
        if (!(await registrationState.inputValue())) await registrationState.fill(TC_05_Favorites.registration.state);
        await expect(registrationCity).toHaveValue(TC_05_Favorites.registration.city);
        await expect(registrationState).toHaveValue(TC_05_Favorites.registration.state);
        const passwordField = page.getByLabel(/^password$/i).first();
        const confirmation = page.getByLabel(/confirm.*password/i).first();
        await passwordField.fill(TC_05_Favorites.registration.weakPassword);
        if (await confirmation.count()) await confirmation.fill(TC_05_Favorites.registration.weakPassword);
        const registerButton = page.getByRole('button', { name: /register|sign up/i });
        await registerButton.click();
        await expect(page.getByText(/password.*(length|character|number|uppercase|special)|weak password/i).first()).toBeVisible();
        await passwordField.fill(TC_05_Favorites.emptyValue);
        await passwordField.pressSequentially(password);
        await passwordField.press('Tab');
        if (await confirmation.count()) await confirmation.fill(password);
        await expect(page.locator('form')).not.toHaveClass(/ng-invalid/);
        await registerButton.click();
    }
    await page.goto(`${toolshopUrl}auth/login`);
    await page.getByPlaceholder('Your email').fill(email);
    await page.getByPlaceholder('Your password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole('heading', { name: 'My account', exact: true })).toBeVisible();
    await page.goto(toolshopUrl);
    await expect(page.getByRole('menubar', { name: 'Main menu' })).toBeVisible();
    await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);

    // Clear this account's previous favorite entries so the test starts clean.
    const favoritesMenu = page.getByRole('menubar', { name: 'Main menu' });
    await favoritesMenu.getByRole('menuitem').last().getByRole('button').click();
    await favoritesMenu.getByRole('link', { name: /my favorites/i }).click();
    await expect(page.getByRole('heading', { name: 'Favorites', exact: true })).toBeVisible();
    const existingNames = (await page.locator('.card-title').allInnerTexts())
        .map(name => name.trim()).filter(Boolean);
    for (const existingName of existingNames) {
        const deletion = page.waitForResponse(response =>
            /\/favorites\//i.test(new URL(response.url()).pathname) && response.request().method() === 'DELETE'
        );
        await page.getByRole('heading', { name: existingName, exact: true }).locator('xpath=ancestor::div[.//button][1]').getByRole('button').click();
        expect((await deletion).status()).toBe(204);
    }
    await page.goto(toolshopUrl);
    await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);

    await page.getByRole('textbox', { name: 'Search' }).fill(TC_05_Favorites.searchTerms.firstProduct);
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByRole('heading', { name: /searched for: Combination Pliers/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Combination Pliers', exact: true })).toBeVisible();
    await page.locator('.card:visible').filter({ has: page.getByRole('heading', { name: 'Combination Pliers', exact: true }) }).getByRole('heading', { name: 'Combination Pliers', exact: true }).click();
    await expect(page).toHaveURL(/\/product\//);

    const favoriteAction = page.getByRole('button', { name: /add to favourites/i });
    await expect(favoriteAction).toBeVisible();
    const combinationAdded = page.waitForResponse(response =>
        response.url().endsWith('/favorites') && response.request().method() === 'POST'
    );
    await favoriteAction.click();
    const combinationResponse = await combinationAdded;
    if (!combinationResponse.ok()) {
        // The demo account can retain favorites between runs; the UI explicitly
        // reports that this product is already saved in that case.
        await expect(page.getByRole('alert')).toContainText(/already in your favorites/i);
    }

    await page.goto(toolshopUrl);
    await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);
    await page.getByRole('textbox', { name: 'Search' }).fill(TC_05_Favorites.searchTerms.secondProduct);
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByRole('heading', { name: /searched for: Hammer/i })).toBeVisible();
    const hammerCards = page.locator('a[href*="/product/"]').filter({ hasText: /hammer/i });
    await expect.poll(async () => hammerCards.count()).toBeGreaterThan(0);
    const hammerCardCount = await hammerCards.count();
    let selectedHammerName: string | undefined;
    for (let index = 0; index < hammerCardCount; index++) {
        const candidate = hammerCards.nth(index);
        if (await candidate.getByText(/out of stock/i).count()) continue;
        selectedHammerName = (await candidate.locator('h5').innerText()).trim();
        break;
    }
    if (!selectedHammerName) throw new Error('No hammer product is available in the catalog results.');
    await page.locator('a[href*="/product/"]').filter({ has: page.getByRole('heading', { name: selectedHammerName, exact: true }) }).getByRole('heading', { name: selectedHammerName, exact: true }).click();
    await expect(page).toHaveURL(/\/product\//);
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeEnabled();
    const hammerFavoriteAction = page.getByRole('button', { name: /add to favourites/i });
    await expect(hammerFavoriteAction).toBeVisible();
    const hammerAdded = page.waitForResponse(response =>
        response.url().endsWith('/favorites') && response.request().method() === 'POST'
    );
    await hammerFavoriteAction.click();
    const hammerResponse = await hammerAdded;
    if (!hammerResponse.ok()) await expect(page.getByRole('alert')).toContainText(/already in your favorites/i);

    await page.goto(toolshopUrl);
    await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);
    const userMenu = page.getByRole('menubar', { name: 'Main menu' });
    await userMenu.getByRole('menuitem').last().getByRole('button').click();
    await userMenu.getByRole('link', { name: /my account/i }).click();
    await expect(page).toHaveURL(/\/account/);
    const accountMenu = page.getByRole('menubar', { name: 'Main menu' });
    await accountMenu.getByRole('menuitem').last().getByRole('button').click();
    await accountMenu.getByRole('link', { name: /my favorites/i }).click();
    await expect(page).toHaveURL(/\/account\/favorites/);

    await expect(page.getByRole('heading', { name: 'Favorites', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Combination Pliers', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: selectedHammerName, exact: true })).toBeVisible();
    expect(await page.getByRole('heading').count()).toBeGreaterThanOrEqual(3);

    const combinationCard = page.getByRole('heading', { name: 'Combination Pliers', exact: true }).locator('xpath=ancestor::div[.//button][1]');
    const removeCombination = page.waitForResponse(response =>
        /\/favorites\//i.test(new URL(response.url()).pathname) && response.request().method() === 'DELETE'
    );
    await combinationCard.getByRole('button').click();
    expect((await removeCombination).status()).toBe(204);
    await expect(page.getByRole('heading', { name: 'Combination Pliers', exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: selectedHammerName, exact: true })).toBeVisible();
    const hammerCard = page.getByRole('heading', { name: selectedHammerName, exact: true }).locator('xpath=ancestor::div[.//button][1]');
    const removeHammer = page.waitForResponse(response =>
        /\/favorites\//i.test(new URL(response.url()).pathname) && response.request().method() === 'DELETE'
    );
    await hammerCard.getByRole('button').click();
    expect((await removeHammer).status()).toBe(204);
    await expect(page.getByRole('heading', { name: selectedHammerName, exact: true })).toHaveCount(0);

    await page.goto(toolshopUrl);
    await page.getByRole('textbox', { name: 'Search' }).fill(TC_05_Favorites.searchTerms.firstProduct);
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByRole('heading', { name: /searched for: Combination Pliers/i })).toBeVisible();
    await page.locator('.card:visible').filter({ has: page.getByRole('heading', { name: 'Combination Pliers', exact: true }) }).getByRole('heading', { name: 'Combination Pliers', exact: true }).click();
    await expect(page.getByRole('button', { name: /favourites?/i }).first()).toBeVisible();
    const logoutMenu = page.getByRole('menubar', { name: 'Main menu' });
    await logoutMenu.getByRole('menuitem').last().getByRole('button').click();
    await logoutMenu.getByText('Sign out', { exact: true }).click();
    await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
});
