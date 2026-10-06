import {test} from '@playwright/test';

test(`File upload learning`, async({page}) =>{

    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name: `Uploads & Downloads`}).scrollIntoViewIfNeeded();
    //await page.locator(`#singleFileInput`).setInputFiles(`C:\\Users\\AaradhyaVashisht\\Downloads\\AZ5831094508.pdf`)
    await page.locator(`#singleFileInput`).setInputFiles(`test-data/Playwright-Cheat-Sheet.pdf`)
    await page.waitForTimeout(4000);
    await page.getByTestId(`single-upload-btn`).click();
    await page.waitForTimeout(4000);
})

test(`File upload learning-2`, async({browser}) =>{

    let context =  await browser.newContext();
    let page =  await context.newPage();

    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name: `Uploads & Downloads`}).scrollIntoViewIfNeeded();

    let [fileChooser] = await Promise.all([
        page.waitForEvent(`filechooser`),
        page.locator(`//label[@for='singleFileInput']`).click()
    ])    
    
    fileChooser.setFiles(`test-data/Playwright-Cheat-Sheet.pdf`)
    await page.waitForTimeout(4000);
    await page.getByTestId(`single-upload-btn`).click();
    await page.waitForTimeout(4000);
})


test(`Multiple File upload learning-2`, async({browser}) =>{

    let context =  await browser.newContext();
    let page =  await context.newPage();

    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name: `Uploads & Downloads`}).scrollIntoViewIfNeeded();

    const files=[`test-data/Playwright-Cheat-Sheet.pdf`, `test-data/automation-Sheet.pdf`]


    let [fileChooser] = await Promise.all([
        page.waitForEvent(`filechooser`),
        page.locator(`//label[@for='multiFileInput']`).click()
    ])    
    
    fileChooser.setFiles(files);
    await page.waitForTimeout(4000);
    await page.getByTestId(`multi-upload-btn`).click();
    await page.waitForTimeout(4000);
})