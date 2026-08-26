//import {test} from `@playwright/test`;
import {test} from "@playwright/test";
test (`Tricentis Login Test Case`, async ({browser})=>{

     const conext = await browser.newContext();
     const page = await conext.newPage();
     page.goto (`https://demowebshop.tricentis.com/login`);
     await page.waitForTimeout(1000);
     await page.locator (`#Email`).fill(`vxm@gmail.com`);
     await page.waitForTimeout(1000);
     await page.locator(`#Password`).fill(`Admin@123`);
     await page.waitForTimeout(1000);
     //await page.locator(`.button-1 login-button`).click();
     await page.locator('.button-1.login-button').click();
     await page.waitForTimeout(1000);
     await page.locator(`.ico-logout`).click();
     await page.waitForTimeout(1000);


})