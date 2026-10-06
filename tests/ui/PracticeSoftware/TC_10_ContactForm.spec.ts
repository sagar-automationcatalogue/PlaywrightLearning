import { expect, test } from '@playwright/test';
test('@regression TC_10_ContactForm: Validate Fields → Attach Files → Submit', async ({ page }) => {
    const toolshopUrl = 'https://practicesoftwaretesting.com/';
    await page.goto(toolshopUrl);
    await expect(page.getByRole('menubar', { name: 'Main menu' })).toBeVisible();
    await expect.poll(async () => page.locator('.card:visible .card-title').count()).toBeGreaterThan(0);
    await page.getByRole('link', { name: /contact/i }).click();
    await expect(page).toHaveURL(/contact/);
    const fields: Array<[RegExp, string]> = [
        [/first name/i, 'Playwright'], [/last name/i, 'Student'],
        [/email/i, 'playwright.student@example.com'],
    ];
    for (const [label, value] of fields) await page.getByLabel(label).fill(value);
    const subject = page.getByLabel(/subject/i);
    const customerService = subject.getByRole('option', { name: /customer service/i });
    if (await customerService.count()) {
        const value = await customerService.getAttribute('value');
        if (value !== null) await subject.selectOption(value);
    } else if (await subject.count()) await subject.selectOption({ index: 1 });
    const message = page.getByLabel(/message/i);

    await page.getByRole('button', { name: /send|submit/i }).click();
    await expect(page.getByText(/required|invalid|must be/i).first()).toBeVisible();
    await message.fill('Short');
    await page.getByRole('button', { name: /send|submit/i }).click();
    await expect(page.getByRole('alert')).toContainText(/minimal 50 characters/i);

    await message.fill('I need help with an automated order placed through the Toolshop demo. Please confirm the expected delivery details.');
    await message.blur();
    await expect(page.getByRole('alert')).toHaveCount(0);
    const fileInput = page.locator('input[type="file"]').first();
    const acceptedTypes = await fileInput.getAttribute('accept');
    expect(acceptedTypes).toMatch(/\.txt/i);
    expect(acceptedTypes).not.toMatch(/\.pdf/i);
    await fileInput.setInputFiles({ name: 'invalid.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
    await fileInput.setInputFiles([]);
    await fileInput.setInputFiles({ name: 'automation-note.txt', mimeType: 'text/plain', buffer: Buffer.alloc(0) });
    await expect(fileInput).toHaveValue(/automation-note\.txt/i);
    await page.getByRole('button', { name: /send|submit/i }).click();
    await expect(page.getByRole('alert')).toContainText(/thanks for your message/i);

    await page.goto(`${toolshopUrl}contact`);
    for (const [label] of fields) await expect(page.getByLabel(label)).toHaveValue('');
    await expect(page.getByLabel(/message/i)).toHaveValue('');
});
