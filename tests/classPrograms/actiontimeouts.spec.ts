import {test} from '@playwright/test';

test(`Action timeouts demo`, async({page}) =>{
    await page.goto(`https://practice.expandtesting.com/dynamic-controls`);

    await page.setDefaultTimeout(10_000);

    //let textbox_locator= await page.locator(`#input-example input`);
    await page.locator(`#input-example button`).click();
    await page.locator(`#input-example input`).fill(`Automation`, {timeout:15_000})
})