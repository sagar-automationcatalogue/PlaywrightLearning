import {test} from "@playwright/test";

test(`test case using abs xpath locator`,async({page})=>{
    await page.goto(`https://www.automationexercise.com/`);
    await page.locator(`xpath=/html/body/header/div/div/div/div[2]/div/ul/li[4]/a`).click();
    await page.locator(`xpath=/html/body/section/div/div/div[1]/div/form/input[2]`).fill(`sagar.automationcatalogue8@gmail.com`);
    await page.locator(`xpath=/html/body/section/div/div/div[1]/div/form/input[3]`).fill(`Admin@123`);
    await page.locator(`xpath=/html/body/section/div/div/div[1]/div/form/button`).click();
    await page.waitForLoadState(`domcontentloaded`);
    let message=await page.locator(`xpath=/html/body/header/div/div/div/div[2]/div/ul/li[10]/a`).textContent();
    console.log(message);
})
