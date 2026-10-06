import {test} from '@playwright/test';

test(`Learning JS-alerts/pop-ups`, async({browser})=>{
    let context =  await browser.newContext();
    let page =  await context.newPage();

    await page.goto(`https://practice.expandtesting.com/js-dialogs`);

    page.once(`dialog`, async alert =>{
        console.log(`Type of alert is ${alert.type()}`);
        console.log(`Message from the alert is: ${alert.message()}`)
        await alert.accept();
    });
    await page.locator(`#js-alert`).click();

    await page.waitForTimeout(4000);

});

test(`Learning JS-Confirm/pop-ups`, async({browser})=>{
    let context =  await browser.newContext();
    let page =  await context.newPage();

    await page.goto(`https://practice.expandtesting.com/js-dialogs`);

    page.once(`dialog`, async alert =>{
        console.log(`Type of alert is ${alert.type()}`);
        console.log(`Message from the alert is: ${alert.message()}`)
        await alert.dismiss();
    });
    await page.locator(`#js-confirm`).click();

    await page.waitForTimeout(4000);

});

test(`Learning JS-Prompt/pop-ups`, async({browser})=>{
    let context =  await browser.newContext();
    let page =  await context.newPage();

    await page.goto(`https://practice.expandtesting.com/js-dialogs`);

    page.once(`dialog`, async alert =>{
        console.log(`Type of alert is ${alert.type()}`);
        console.log(`Message from the alert is: ${alert.message()}`)
        await alert.accept(`Automation`)
    });
    await page.locator(`#js-prompt`).click();

    await page.waitForTimeout(4000);

});