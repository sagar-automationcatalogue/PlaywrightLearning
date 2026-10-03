import { expect, test } from "@playwright/test";

test(`TC 02 Dynamic registration validation and login`, async ({ page }) => {
    const registrationPassword = `Automation@123`;
    const mismatchPassword = `Automation@456`;
    const username = `student-${Date.now()}`;

    console.log(`Generated registration username: ${username}`);

    await page.goto(`https://practice.expandtesting.com/register`);
    await expect(page).toHaveURL(`https://practice.expandtesting.com/register`);
    await expect(page.getByLabel(`Username`)).toBeVisible();
    await expect(page.getByLabel(`Password`, { exact: true })).toBeVisible();
    await expect(page.getByLabel(`Confirm Password`)).toBeVisible();
    await expect(page.getByRole(`button`, { name: `Register` })).toBeVisible();

    await page.getByRole(`button`, { name: `Register` }).click();
    await expect(page.getByText(`All fields are required.`)).toBeVisible();
    console.log(`Required-field validation verified`);

    await page.getByLabel(`Username`).fill(username);
    await page.getByLabel(`Confirm Password`).fill(registrationPassword);
    await expect(page.getByLabel(`Username`)).toHaveValue(username);
    await expect(page.getByLabel(`Password`, { exact: true })).toHaveValue(``);
    await expect(page.getByLabel(`Confirm Password`)).toHaveValue(registrationPassword);
    await page.getByRole(`button`, { name: `Register` }).click();
    await expect(page.getByText(`All fields are required.`)).toBeVisible();
    console.log(`Missing-password validation verified`);

    await page.getByLabel(`Username`).fill(``);
    await page.getByLabel(`Password`, { exact: true }).fill(``);
    await page.getByLabel(`Confirm Password`).fill(``);
    await page.getByLabel(`Username`).fill(username);
    await page.getByLabel(`Password`, { exact: true }).fill(registrationPassword);
    await page.getByLabel(`Confirm Password`).fill(mismatchPassword);
    await page.getByRole(`button`, { name: `Register` }).click();
    await expect(page.getByText(`Passwords do not match.`)).toBeVisible();
    console.log(`Password mismatch validation verified`);

    await page.getByLabel(`Username`).fill(username);
    await page.getByLabel(`Password`, { exact: true }).fill(registrationPassword);
    await page.getByLabel(`Confirm Password`).fill(registrationPassword);
    await page.getByRole(`button`, { name: `Register` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/login`);
    await expect(page.getByText(`Successfully registered, you can log in now.`)).toBeVisible();
    console.log(`Registration successful`);

    await page.getByLabel(`Username`).fill(username);
    await page.getByLabel(`Password`, { exact: true }).fill(registrationPassword);
    await page.getByRole(`button`, { name: `Login` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/secure`);
    await expect(page.getByText(`You logged into a secure area!`)).toBeVisible();
    await expect(page.getByRole(`link`, { name: `Logout` })).toBeVisible();
    console.log(`First login successful`);

    await page.getByRole(`link`, { name: `Logout` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/login`);
    console.log(`First logout successful`);

    await page.getByLabel(`Username`).fill(username);
    await page.getByLabel(`Password`, { exact: true }).fill(registrationPassword);
    await page.getByRole(`button`, { name: `Login` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/secure`);
    await expect(page.getByText(`You logged into a secure area!`)).toBeVisible();
    console.log(`Second login successful`);

    await page.getByRole(`link`, { name: `Logout` }).click();
    await expect(page).toHaveURL(`https://practice.expandtesting.com/login`);
    console.log(`Final logout successful`);
});