import {test} from '@playwright/test';
test(`Tricenties Registration Test Case`, async ({browser})=>{
     const context = await browser.newContext();
     const page = await context.newPage();

      page.goto(`https://demowebshop.tricentis.com/`);
     await page.waitForTimeout(1000);
     await page.locator(`.ico-register`).click();
     await page.waitForTimeout(1000);
     await page.locator(`#gender-male`).click();
     await page.waitForTimeout (1000);
     await page.locator(`#FirstName`).fill(`Pulla Rao`);
     await page.waitForTimeout (1000);
     await page.locator(`#LastName`).fill(`Athmakuri`);
     await page.locator(`#Email`).fill(`vxm@gmail.com`);
     await page.waitForTimeout (1000);
     await page.locator(`#Password`).fill(`Admin@123`);
     await page.waitForTimeout (1000);
     await page.locator(`#ConfirmPassword`).fill(`Admin@123`);
     await page.waitForTimeout (1000);
     await page.locator(`#register-button`).click();
     await page.waitForTimeout (1000);

     

   
})
