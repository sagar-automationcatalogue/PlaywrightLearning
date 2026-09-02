import {test} from '@playwright/test';

test('Retrieving text using playwright methods', async({page}) =>{
    await page.goto(`https://the-internet.herokuapp.com/dynamic_loading/1`);

    console.log(`================== textContent()===================`);
    let message1 = await page.locator(`//div[@class='example']`).textContent();
    console.log(message1);


    console.log(`================== innexText()===================`);
    let message2 = await page.locator(`//div[@class='example']`).innerText();
    console.log(message2);
    await page.waitForTimeout(3000);
})