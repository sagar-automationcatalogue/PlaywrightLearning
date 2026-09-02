import {test} from '@playwright/test';

test('Retriving text from multiple elements using single locator', async({page}) =>{
    await page.goto(`https://www.automationexercise.com/`);

    //let allBrands = await page.locator(`//ul[@class='nav nav-pills nav-stacked']`).allTextContents();
    let allBrands = await page.locator(`//ul[@class='nav nav-pills nav-stacked']/li/a`).allInnerTexts();
    console.log(allBrands);

    console.log(`Length of the array is : ${allBrands.length}`);
    console.log(allBrands.includes(`(4)\nBABYHUG`));
    
    for(let brand of allBrands){
        console.log(brand);
    }

    await page.waitForTimeout(3000);
})