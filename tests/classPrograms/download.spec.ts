import {test} from '@playwright/test';

test(`File Download learning`, async({page}) =>{

    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name: `Uploads & Downloads`}).scrollIntoViewIfNeeded();
    
    
    const [download] = await Promise.all([
        page.waitForEvent(`download`),
        page.getByRole(`link`, {name: ` Download PDF`}).click()
    ])

    let fileName = await download.suggestedFilename();
    console.log(`File Name is : ${fileName}`);

    await download.saveAs(`test-data/automation-catalogue-sheet.pdf`);
    
    await page.waitForTimeout(4000);
})

test(`Open PDF learning`, async({browser}) =>{

    let context =  await browser.newContext();
    let context1 =  await browser.newContext();
    let context2 =  await browser.newContext();
    let page =  await context.newPage();
    let page1 =  await context1.newPage();
    let page2 =  await context2.newPage();


    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name: `Uploads & Downloads`}).scrollIntoViewIfNeeded();
    
    
    const [newPage] = await Promise.all([
        context.waitForEvent(`page`),
        page.getByTestId(`open-pdf-btn`).click()
    ])

    let url = await newPage.url();
    console.log(`New PDF Page URL is ${url}`);
    await page.waitForTimeout(4000);

    await page.bringToFront();    

    await page.waitForTimeout(4000);
    await newPage.bringToFront();   
    
    await page.waitForTimeout(4000);
})