import {test} from '@playwright/test';

test(`Learning Multiple windows/tabs switching`, async({browser})=>{
    let context =  await browser.newContext();
    let page =  await context.newPage();
    
    await page.goto(`https://automation44-trials8101.orangehrmlive.com/auth/login`);
    await page.getByPlaceholder(`Username`).fill(`admin`);
    await page.getByPlaceholder(`Password`).fill(`Admin@123`);
    await page.getByRole(`button`, {name:`Login`}).click();
    await page.getByRole(`link`, {name:`Onboarding`}).click();

    const [newPage] = await Promise.all([
        context.waitForEvent(`page`, {timeout:20_000}),
        page.getByRole(`link`,{name: `Leila Yasmin Hassan`}).click({timeout:20_000})
    ])     
    

    let message = await newPage.locator(`.oxd-text.oxd-text--p.oxd-text--card-title`).last().innerText();
    console.log(message);
    await newPage.getByText(`Send`).last().click();

    await page.bringToFront();
    await page.locator(`//a[@data-automation-id='menu_onboarding_On/Offboarding']`).click();
    await page.locator(`//a[@data-automation-id='menu_onboarding_viewMyTasks']`).click();
    let taskURL = await page.url();
    console.log(taskURL);    
    await page.waitForTimeout(4000);
    await page.close();

    await newPage.bringToFront();
    await newPage.getByText(`Yes, Send`).click();
    

    await page.waitForTimeout(4000);
    
})