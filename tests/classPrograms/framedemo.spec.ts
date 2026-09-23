import {test} from '@playwright/test';

test(`Frames Explanation learning`, async({page}) =>{

    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name:`Frames & Windows`}).scrollIntoViewIfNeeded();

    let frameLocator = await page.frameLocator(`#practiceFrame`);
    await frameLocator.getByPlaceholder(`Enter your name`).fill(`Playwright Automation`);
    await frameLocator.getByTestId(`iframe-textarea`).fill(`I am learning Playwright frame concepts`);
    await frameLocator.getByTestId(`iframe-select`).selectOption(`Critical`);
    await frameLocator.getByLabel(`Mark as urgent`).check();
    await page.getByTestId(`nav-menu`).hover();
    await page.waitForTimeout(4000);
    await frameLocator.getByRole(`button`,{name:`Submit`}).click();
    let sucessMessage = await frameLocator.getByTestId(`iframe-result`).innerText();
    console.log(sucessMessage);
    //await page.getByPlaceholder(`Enter your name`).fill(`Playwright Automation`);

    await page.waitForTimeout(4000);



})


test(`Frames Explanation learning-2`, async({page}) =>{

    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name:`Frames & Windows`}).scrollIntoViewIfNeeded();

    let frame = await page.frame({ url: /iframe-content\.html/ });
    await frame?.getByPlaceholder(`Enter your name`).fill(`Playwright Automation`);
    await frame?.getByTestId(`iframe-textarea`).fill(`I am learning Playwright frame concepts`);
    await frame?.getByTestId(`iframe-select`).selectOption(`Critical`);
    await frame?.getByLabel(`Mark as urgent`).check();
    await page.getByTestId(`nav-menu`).hover();
    await page.waitForTimeout(4000);
    await frame?.getByRole(`button`,{name:`Submit`}).click();
    let sucessMessage = await frame?.getByTestId(`iframe-result`).innerText();
    console.log(sucessMessage);
    //await page.getByPlaceholder(`Enter your name`).fill(`Playwright Automation`);

    await page.waitForTimeout(4000);



})


test(`NestedFrames Explanation learning-2`, async({page}) =>{

    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name:`Frames & Windows`}).scrollIntoViewIfNeeded();

    /*let outerframeLocator = await page.frameLocator(`#nestedFramesFrame`);    
    let innerFrameLocator = await outerframeLocator.frameLocator(`#innerFrame`);
    await innerFrameLocator.getByLabel(`Your Name`).fill(`Automation`);*/

    await page.frameLocator(`#nestedFramesFrame`).frameLocator(`#innerFrame`).getByLabel(`Your Name`).fill(`Automation`);

    await page.waitForTimeout(4000);



})