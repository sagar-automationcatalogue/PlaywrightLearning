import {test} from '@playwright/test';

test(`Playwright in-built locators`, async({page}) =>{
    await page.goto("https://demowebshop.tricentis.com/");
    //await page.getByAltText("Picture of $25 Virtual Gift Card").click();
    await page.getByTitle(`Show details for $25 Virtual Gift Card`).nth(1).click();

    let url = await page.url();
    console.log(`URL of the page is ${url}`);

    let title = await page.title();
    console.log(`Title of the application is ${title}`);

    await page.waitForTimeout(6000);
});